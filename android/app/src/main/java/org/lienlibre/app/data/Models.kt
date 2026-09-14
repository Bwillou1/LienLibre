package org.lienlibre.app.data

import kotlinx.serialization.Serializable

@Serializable
data class Capsule(
    val id: String = "",
    val originalUrl: String,
    val title: String = "",
    val excerpt: String = "",
    val siteName: String = "",
    val timestamp: Long = System.currentTimeMillis(),
    val shortCode: String = "",
    val ipfsCid: String? = null,
    val arweaveId: String? = null,
    val directViewerUrl: String = "",
    val eReaderPin: String = "",
    val aiAnalysis: AiAnalysisResult? = null
)

@Serializable
data class AiAnalysisResult(
    val isPaywall: Boolean = false,
    val paywallConfidence: Float = 0f,
    val isClickbait: Boolean = false,
    val clickbaitConfidence: Float = 0f,
    val civicReliabilityScore: Int = 100, // 0 to 100
    val summary: String = "",
    val warnings: List<String> = emptyList()
)

@Serializable
data class CivilAlert(
    val id: String,
    val title: String,
    val description: String,
    val severity: AlertSeverity,
    val region: String,
    val timestamp: Long,
    val sourceUrl: String
)

enum class AlertSeverity {
    INFO,
    WARNING,
    CRITICAL,
    EMERGENCY
}

data class EreaderSyncState(
    val pinCode: String = "",
    val paired: Boolean = false,
    val lastSentTitle: String = ""
)
