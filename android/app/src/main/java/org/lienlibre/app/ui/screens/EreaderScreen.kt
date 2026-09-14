package org.lienlibre.app.ui.screens

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material.icons.filled.MenuBook
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import org.lienlibre.app.network.LienLibreApi
import org.lienlibre.app.ui.theme.CyanPrimary
import org.lienlibre.app.ui.theme.GoldAccent

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EreaderScreen(
    initialPin: String = ""
) {
    val context = LocalContext.current
    var pinCode by remember { mutableStateOf(initialPin.ifBlank { LienLibreApi.generateEreaderPin() }) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text("📖 Passerelle Liseuse E-Ink", fontWeight = FontWeight.Bold, color = CyanPrimary)
                },
                actions = {
                    IconButton(onClick = { pinCode = LienLibreApi.generateEreaderPin() }) {
                        Icon(Icons.Default.Refresh, contentDescription = "Nouveau code")
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
                .padding(20.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Icon(
                imageVector = Icons.Default.MenuBook,
                contentDescription = null,
                tint = CyanPrimary,
                modifier = Modifier.size(64.dp)
            )

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = "Envoyez des articles instantanément sur votre liseuse Kindle, Kobo ou Boox sans fil.",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            Spacer(modifier = Modifier.height(24.dp))

            // 4-Digit Code Big Display
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(20.dp))
                    .border(2.dp, GoldAccent, RoundedCornerShape(20.dp)),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = "VOTRE CODE D'APPAIRAGE (PIN)",
                        style = MaterialTheme.typography.labelSmall,
                        color = GoldAccent,
                        fontWeight = FontWeight.Bold
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    Text(
                        text = pinCode,
                        fontSize = 48.sp,
                        fontWeight = FontWeight.ExtraBold,
                        fontFamily = FontFamily.Monospace,
                        letterSpacing = 12.sp,
                        color = MaterialTheme.colorScheme.onSurface
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    Text(
                        text = "1. Ouvrez le navigateur expérimental de votre liseuse\n2. Rendez-vous sur bwillou1.github.io/LienLibre/ereader.html\n3. Entrez ces 4 chiffres pour que la liseuse charge la passerelle et ouvre le lien direct chez l'éditeur avec un rendu optimisé E-Ink.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            Button(
                onClick = {
                    val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                    val clip = ClipData.newPlainText("Ereader PIN", pinCode)
                    clipboard.setPrimaryClip(clip)
                    Toast.makeText(context, "Code PIN $pinCode copié !", Toast.LENGTH_SHORT).show()
                },
                modifier = Modifier.fillMaxWidth().height(48.dp),
                shape = RoundedCornerShape(12.dp),
                colors = ButtonDefaults.buttonColors(containerColor = CyanPrimary)
            ) {
                Icon(Icons.Default.ContentCopy, contentDescription = null, tint = MaterialTheme.colorScheme.background)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Copier le code PIN", color = MaterialTheme.colorScheme.background, fontWeight = FontWeight.Bold)
            }
        }
    }
}
