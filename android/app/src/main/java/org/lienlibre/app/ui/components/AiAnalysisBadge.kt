package org.lienlibre.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import org.lienlibre.app.data.AiAnalysisResult
import org.lienlibre.app.ui.theme.AlertGreen
import org.lienlibre.app.ui.theme.AlertRed
import org.lienlibre.app.ui.theme.AlertYellow
import org.lienlibre.app.ui.theme.CyanPrimary

@Composable
fun AiAnalysisBadge(
    analysis: AiAnalysisResult,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.6f))
            .border(1.dp, CyanPrimary.copy(alpha = 0.3f), RoundedCornerShape(16.dp))
            .padding(16.dp)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween,
            modifier = Modifier.fillMaxWidth()
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Default.AutoAwesome,
                    contentDescription = "Edge AI",
                    tint = CyanPrimary,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "Edge AI • Analyse Locale Embarquée",
                    style = MaterialTheme.typography.titleMedium,
                    color = CyanPrimary
                )
            }

            // Score Pill
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(12.dp))
                    .background(
                        if (analysis.civicReliabilityScore >= 80) AlertGreen.copy(alpha = 0.2f)
                        else AlertYellow.copy(alpha = 0.2f)
                    )
                    .padding(horizontal = 8.dp, vertical = 4.dp)
            ) {
                Text(
                    text = "Indice : ${analysis.civicReliabilityScore}%",
                    style = MaterialTheme.typography.labelSmall,
                    color = if (analysis.civicReliabilityScore >= 80) AlertGreen else AlertYellow
                )
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Paywall Banner
        if (analysis.isPaywall) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(8.dp))
                    .background(AlertRed.copy(alpha = 0.15f))
                    .padding(8.dp)
            ) {
                Icon(Icons.Default.Lock, contentDescription = null, tint = AlertRed, modifier = Modifier.size(18.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "Mur Payant / Abonnement Requis Détecté",
                    style = MaterialTheme.typography.bodyMedium,
                    color = AlertRed
                )
            }
            Spacer(modifier = Modifier.height(6.dp))
        }

        // Clickbait Banner
        if (analysis.isClickbait) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(8.dp))
                    .background(AlertYellow.copy(alpha = 0.15f))
                    .padding(8.dp)
            ) {
                Icon(Icons.Default.Warning, contentDescription = null, tint = AlertYellow, modifier = Modifier.size(18.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "Alerte Titre Accrocheur / Piège à clics",
                    style = MaterialTheme.typography.bodyMedium,
                    color = AlertYellow
                )
            }
            Spacer(modifier = Modifier.height(6.dp))
        }

        // On-device AI Summary
        if (analysis.summary.isNotBlank()) {
            Text(
                text = analysis.summary,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}
