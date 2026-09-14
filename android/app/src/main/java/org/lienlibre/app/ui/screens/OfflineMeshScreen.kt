package org.lienlibre.app.ui.screens

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.graphics.Bitmap
import android.widget.Toast
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Stop
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.google.zxing.BarcodeFormat
import com.google.zxing.qrcode.QRCodeWriter
import kotlinx.coroutines.delay
import org.lienlibre.app.network.LienLibreApi
import org.lienlibre.app.ui.theme.CyanPrimary
import org.lienlibre.app.ui.theme.GoldAccent

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun OfflineMeshScreen(
    initialData: String = ""
) {
    val context = LocalContext.current
    val scrollState = rememberScrollState()

    var payloadText by remember { mutableStateOf(initialData.ifBlank { "https://bwillou1.github.io/LienLibre" }) }
    var txqrFrames by remember { mutableStateOf(LienLibreApi.prepareTxqrFrames(payloadText)) }
    var currentFrameIndex by remember { mutableStateOf(0) }
    var isPlaying by remember { mutableStateOf(true) }
    var fps by remember { mutableStateOf(4f) }

    // Recompute frames when text changes
    LaunchedEffect(payloadText) {
        txqrFrames = LienLibreApi.prepareTxqrFrames(payloadText)
        currentFrameIndex = 0
    }

    // Animation Loop for TXQR sequence
    LaunchedEffect(isPlaying, txqrFrames, fps) {
        if (isPlaying && txqrFrames.isNotEmpty()) {
            while (true) {
                delay((1000L / fps).toLong())
                currentFrameIndex = (currentFrameIndex + 1) % txqrFrames.size
            }
        }
    }

    val currentFrameData = txqrFrames.getOrElse(currentFrameIndex) { "" }
    val qrBitmap = remember(currentFrameData) {
        generateQrBitmap(currentFrameData, 512)
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text("🛰️ Réseau Hors-Ligne & TXQR", fontWeight = FontWeight.Bold, color = CyanPrimary)
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp)
                .verticalScroll(scrollState),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "Transmettez des articles entiers sans Internet ni réseau cellulaire grâce aux flux QR animés (TXQR) et aux paquets LoRa Meshtastic.",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            Spacer(modifier = Modifier.height(16.dp))

            // TXQR Animated Display Card
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(16.dp))
                    .border(1.dp, CyanPrimary.copy(alpha = 0.5f), RoundedCornerShape(16.dp)),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = "Flux TXQR Animé (${currentFrameIndex + 1} / ${txqrFrames.size})",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = GoldAccent
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    // QR Display
                    Box(
                        modifier = Modifier
                            .size(240.dp)
                            .background(Color.White, RoundedCornerShape(12.dp))
                            .padding(8.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        qrBitmap?.let {
                            Image(
                                bitmap = it.asImageBitmap(),
                                contentDescription = "TXQR Frame",
                                modifier = Modifier.fillMaxSize()
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    Text(
                        text = currentFrameData,
                        style = MaterialTheme.typography.labelSmall,
                        fontFamily = FontFamily.Monospace,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        maxLines = 1
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    // Speed Slider & Controls
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        IconButton(onClick = { isPlaying = !isPlaying }) {
                            Icon(
                                imageVector = if (isPlaying) Icons.Default.Stop else Icons.Default.PlayArrow,
                                contentDescription = if (isPlaying) "Pause" else "Play",
                                tint = CyanPrimary
                            )
                        }

                        Text("Vitesse : ${fps.toInt()} FPS", style = MaterialTheme.typography.bodyMedium)

                        Slider(
                            value = fps,
                            onValueChange = { fps = it },
                            valueRange = 1f..10f,
                            steps = 8,
                            modifier = Modifier.width(160.dp)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Meshtastic LoRa Packet Card
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(16.dp)),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "📻 Paquet Meshtastic (LoRa 915 MHz)",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = CyanPrimary
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = LienLibreApi.formatMeshtasticPacket("Article d'intérêt public", payloadText),
                        style = MaterialTheme.typography.bodySmall,
                        fontFamily = FontFamily.Monospace,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Button(
                        onClick = {
                            val pkt = LienLibreApi.formatMeshtasticPacket("Article d'intérêt public", payloadText)
                            val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                            clipboard.setPrimaryClip(ClipData.newPlainText("Meshtastic Packet", pkt))
                            Toast.makeText(context, "Paquet Meshtastic copié !", Toast.LENGTH_SHORT).show()
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = CyanPrimary)
                    ) {
                        Icon(Icons.Default.ContentCopy, contentDescription = null, tint = MaterialTheme.colorScheme.background)
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Copier pour Meshtastic App", color = MaterialTheme.colorScheme.background)
                    }
                }
            }
        }
    }
}

private fun generateQrBitmap(content: String, size: Int): Bitmap? {
    if (content.isBlank()) return null
    return try {
        val writer = QRCodeWriter()
        val bitMatrix = writer.encode(content, BarcodeFormat.QR_CODE, size, size)
        val bitmap = Bitmap.createBitmap(size, size, Bitmap.Config.RGB_565)
        for (x in 0 until size) {
            for (y in 0 until size) {
                bitmap.setPixel(x, y, if (bitMatrix.get(x, y)) android.graphics.Color.BLACK else android.graphics.Color.WHITE)
            }
        }
        bitmap
    } catch (e: Exception) {
        null
    }
}
