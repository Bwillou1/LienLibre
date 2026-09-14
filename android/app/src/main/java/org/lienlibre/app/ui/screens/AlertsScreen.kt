package org.lienlibre.app.ui.screens

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.OpenInBrowser
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.WarningAmber
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.launch
import org.lienlibre.app.data.AlertSeverity
import org.lienlibre.app.data.CivilAlert
import org.lienlibre.app.network.LienLibreApi
import org.lienlibre.app.ui.theme.AlertGreen
import org.lienlibre.app.ui.theme.AlertRed
import org.lienlibre.app.ui.theme.AlertYellow
import org.lienlibre.app.ui.theme.CyanPrimary

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AlertsScreen() {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    var alerts by remember { mutableStateOf<List<CivilAlert>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }

    LaunchedEffect(Unit) {
        alerts = LienLibreApi.fetchCivilAlerts()
        isLoading = false
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text("🚨 Hub Alertes Citoyennes", fontWeight = FontWeight.Bold, color = AlertRed)
                },
                actions = {
                    IconButton(onClick = {
                        coroutineScope.launch {
                            isLoading = true
                            alerts = LienLibreApi.fetchCivilAlerts()
                            isLoading = false
                        }
                    }) {
                        Icon(Icons.Default.Refresh, contentDescription = "Actualiser")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            if (isLoading) {
                CircularProgressIndicator(modifier = Modifier.align(Alignment.Center), color = CyanPrimary)
            } else {
                LazyColumn(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    item {
                        Text(
                            text = "Flux d'urgence vérifié et accessible même sans connexion mobile active grâce au réseau maillé.",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                    }

                    items(alerts) { alert ->
                        val severityColor = when (alert.severity) {
                            AlertSeverity.CRITICAL, AlertSeverity.EMERGENCY -> AlertRed
                            AlertSeverity.WARNING -> AlertYellow
                            AlertSeverity.INFO -> AlertGreen
                        }

                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(16.dp))
                                .border(1.dp, severityColor.copy(alpha = 0.4f), RoundedCornerShape(16.dp)),
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
                        ) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Icon(Icons.Default.WarningAmber, contentDescription = null, tint = severityColor)
                                        Spacer(modifier = Modifier.width(8.dp))
                                        Text(
                                            text = alert.region,
                                            style = MaterialTheme.typography.labelSmall,
                                            color = severityColor,
                                            fontWeight = FontWeight.Bold
                                        )
                                    }
                                }

                                Spacer(modifier = Modifier.height(8.dp))

                                Text(
                                    text = alert.title,
                                    style = MaterialTheme.typography.titleMedium,
                                    fontWeight = FontWeight.Bold
                                )

                                Spacer(modifier = Modifier.height(6.dp))

                                Text(
                                    text = alert.description,
                                    style = MaterialTheme.typography.bodyMedium,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )

                                Spacer(modifier = Modifier.height(12.dp))

                                Button(
                                    onClick = {
                                        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(alert.sourceUrl))
                                        context.startActivity(intent)
                                    },
                                    colors = ButtonDefaults.buttonColors(containerColor = severityColor),
                                    shape = RoundedCornerShape(8.dp)
                                ) {
                                    Icon(Icons.Default.OpenInBrowser, contentDescription = null)
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text("Consulter la source officielle")
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
