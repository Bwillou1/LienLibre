package org.lienlibre.app.ui.screens

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.launch
import org.lienlibre.app.ai.OnDeviceAiEngine
import org.lienlibre.app.data.AiAnalysisResult
import org.lienlibre.app.data.Capsule
import org.lienlibre.app.network.LienLibreApi
import org.lienlibre.app.ui.components.AiAnalysisBadge
import org.lienlibre.app.ui.theme.CyanPrimary
import org.lienlibre.app.ui.theme.GoldAccent

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    initialSharedUrl: String = "",
    aiEngine: OnDeviceAiEngine,
    onNavigateToEreader: (String) -> Unit,
    onNavigateToMesh: (String) -> Unit
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    val scrollState = rememberScrollState()

    var inputUrl by remember { mutableStateOf(initialSharedUrl) }
    var inputTitle by remember { mutableStateOf("") }
    var isAnalyzing by remember { mutableStateOf(false) }
    var generatedCapsule by remember { mutableStateOf<Capsule?>(null) }
    var aiAnalysis by remember { mutableStateOf<AiAnalysisResult?>(null) }

    // Auto-analyze if initial URL is shared from system
    LaunchedEffect(initialSharedUrl) {
        if (initialSharedUrl.isNotBlank()) {
            inputUrl = initialSharedUrl
            isAnalyzing = true
            val analysis = aiEngine.analyzeContent(initialSharedUrl, "Article partagé")
            aiAnalysis = analysis
            val pin = LienLibreApi.generateEreaderPin()
            val capUrl = LienLibreApi.createCapsuleUrl(initialSharedUrl, "Article partagé")
            generatedCapsule = Capsule(
                originalUrl = initialSharedUrl,
                title = "Article partagé",
                directViewerUrl = capUrl,
                eReaderPin = pin,
                aiAnalysis = analysis
            )
            isAnalyzing = false
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("⚡ LienLibre", fontWeight = FontWeight.Bold, color = CyanPrimary)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Android", style = MaterialTheme.typography.labelSmall, color = GoldAccent)
                    }
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
                .padding(horizontal = 16.dp)
                .verticalScroll(scrollState),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Spacer(modifier = Modifier.height(16.dp))

            // Subtitle
            Text(
                text = "Générez un lien citoyen inaltérable, résistant aux blocages et accessible hors-ligne.",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            Spacer(modifier = Modifier.height(20.dp))

            // URL Input Card
            OutlinedTextField(
                value = inputUrl,
                onValueChange = { inputUrl = it },
                label = { Text("Collez l'URL d'un article d'actualité") },
                placeholder = { Text("https://...") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true,
                trailingIcon = {
                    IconButton(onClick = {
                        val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                        val clip = clipboard.primaryClip
                        if (clip != null && clip.itemCount > 0) {
                            inputUrl = clip.getItemAt(0).text.toString()
                        }
                    }) {
                        Icon(Icons.Default.ContentPaste, contentDescription = "Coller")
                    }
                },
                shape = RoundedCornerShape(12.dp)
            )

            Spacer(modifier = Modifier.height(12.dp))

            // Optional Title input
            OutlinedTextField(
                value = inputTitle,
                onValueChange = { inputTitle = it },
                label = { Text("Titre ou description (facultatif)") },
                placeholder = { Text("Ex: Reportage d'intérêt public") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true,
                shape = RoundedCornerShape(12.dp)
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Generate Button
            Button(
                onClick = {
                    if (inputUrl.isBlank()) {
                        Toast.makeText(context, "Veuillez entrer une URL valide", Toast.LENGTH_SHORT).show()
                        return@Button
                    }
                    coroutineScope.launch {
                        isAnalyzing = true
                        val analysis = aiEngine.analyzeContent(inputUrl, inputTitle.ifBlank { "Article d'actualité" })
                        aiAnalysis = analysis
                        val pin = LienLibreApi.generateEreaderPin()
                        val capUrl = LienLibreApi.createCapsuleUrl(inputUrl, inputTitle.ifBlank { "Article d'actualité" })
                        generatedCapsule = Capsule(
                            originalUrl = inputUrl,
                            title = inputTitle.ifBlank { "Article d'actualité" },
                            directViewerUrl = capUrl,
                            eReaderPin = pin,
                            aiAnalysis = analysis
                        )
                        isAnalyzing = false
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp),
                shape = RoundedCornerShape(12.dp),
                colors = ButtonDefaults.buttonColors(containerColor = CyanPrimary)
            ) {
                if (isAnalyzing) {
                    CircularProgressIndicator(modifier = Modifier.size(24.dp), color = MaterialTheme.colorScheme.background)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Analyse On-Device AI en cours...", color = MaterialTheme.colorScheme.background)
                } else {
                    Icon(Icons.Default.AutoAwesome, contentDescription = null, tint = MaterialTheme.colorScheme.background)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Générer la Capsule & Analyser", fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.background)
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // AI Analysis Badge
            aiAnalysis?.let { analysis ->
                AiAnalysisBadge(analysis = analysis)
                Spacer(modifier = Modifier.height(16.dp))
            }

            // Generated Result Card
            generatedCapsule?.let { cap ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(16.dp))
                        .border(1.dp, CyanPrimary.copy(alpha = 0.5f), RoundedCornerShape(16.dp)),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = "🎉 Capsule LienLibre Prête !",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = CyanPrimary
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = cap.directViewerUrl,
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )

                        Spacer(modifier = Modifier.height(16.dp))

                        // Action Buttons Row
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            // Native System Share
                            Button(
                                onClick = {
                                    val sendIntent = Intent().apply {
                                        action = Intent.ACTION_SEND
                                        putExtra(Intent.EXTRA_TEXT, "📰 LienLibre : ${cap.title}\n${cap.directViewerUrl}")
                                        type = "text/plain"
                                    }
                                    val shareIntent = Intent.createChooser(sendIntent, "Partager via LienLibre")
                                    context.startActivity(shareIntent)
                                },
                                modifier = Modifier.weight(1f),
                                colors = ButtonDefaults.buttonColors(containerColor = CyanPrimary)
                            ) {
                                Icon(Icons.Default.Share, contentDescription = "Partager", tint = MaterialTheme.colorScheme.background)
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("Partager", color = MaterialTheme.colorScheme.background)
                            }

                            // Copy Link
                            OutlinedButton(
                                onClick = {
                                    val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                                    val clip = ClipData.newPlainText("LienLibre Capsule", cap.directViewerUrl)
                                    clipboard.setPrimaryClip(clip)
                                    Toast.makeText(context, "Lien copié dans le presse-papier !", Toast.LENGTH_SHORT).show()
                                },
                                modifier = Modifier.weight(1f)
                            ) {
                                Icon(Icons.Default.ContentCopy, contentDescription = "Copier")
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("Copier")
                            }
                        }

                        Spacer(modifier = Modifier.height(12.dp))

                        // Quick Navigation Shortcuts to specialized modes
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            OutlinedButton(
                                onClick = { onNavigateToEreader(cap.eReaderPin) },
                                modifier = Modifier.weight(1f)
                            ) {
                                Text("📖 Liseuse (${cap.eReaderPin})")
                            }
                            OutlinedButton(
                                onClick = { onNavigateToMesh(cap.directViewerUrl) },
                                modifier = Modifier.weight(1f)
                            ) {
                                Text("🛰️ TXQR / Mesh")
                            }
                        }
                    }
                }
                Spacer(modifier = Modifier.height(24.dp))
            }
        }
    }
}
