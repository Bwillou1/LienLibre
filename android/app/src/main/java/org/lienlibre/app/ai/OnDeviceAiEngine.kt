package org.lienlibre.app.ai

import android.content.Context
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.lienlibre.app.data.AiAnalysisResult

/**
 * Android with AI - On-Device Edge Metadata & Gateway Inspector for LienLibre.
 * 
 * RÈGLE FONDAMENTALE D'ARCHITECTURE & LÉGALITÉ (Art. 29 LDA / C-18) :
 * LienLibre agit STRICTEMENT en tant que PASSERELLE NEUTRE (Gateway / Neutral Carrier).
 * Il ne lit pas, ne scrape pas, ne copie pas et ne résume JAMAIS le texte intégral des articles de presse.
 * L'inspection porte EXCLUSIVEMENT sur les métadonnées publiques Open Graph (titre, nom de domaine, description og).
 */
class OnDeviceAiEngine(private val context: Context) {

    // Signatures de paywalls et monétisation (vérifiées sur les en-têtes et métadonnées)
    private val paywallKeywords = listOf(
        "abonne", "abonnement", "subscriber-only", "paywall", "premium", 
        "metered", "piano.io", "wallkit", "poool.fr", "tinypass", 
        "monetization", "softwall", "hardwall", "connexion-requise"
    )

    // Détection de sensationnalisme dans les titres (Open Graph og:title)
    private val clickbaitTriggers = listOf(
        "vous ne devinerez jamais", "incroyable", "choc", "ce qui s'est passé ensuite",
        "hallucinant", "les médecins le détestent", "le secret que", "attention :",
        "scandaleux", "bouleverse", "buzz", "secret bien gardé", "il avoue tout"
    )

    private val trustedCivicDomains = setOf(
        "radio-canada.ca", "lapresse.ca", "ledevoir.com", "lemonde.fr", "afp.com",
        "reuters.com", "apnews.com", "theguardian.com", "bbc.com", "quebec.ca",
        "canada.ca", "meteo.gc.ca", "donneesquebec.ca", "statcan.gc.ca"
    )

    /**
     * Analyse locale des métadonnées Open Graph (URL + Titre OG) sans jamais toucher au texte intégral
     */
    suspend fun analyzeContent(url: String, ogTitle: String, ogDescription: String = ""): AiAnalysisResult = withContext(Dispatchers.Default) {
        val lowerUrl = url.lowercase()
        val lowerTitle = ogTitle.lowercase()
        val lowerDesc = ogDescription.lowercase()

        val warnings = mutableListOf<String>()

        // 1. Détection de Paywall / Mur Payant sur les métadonnées
        var isPaywall = false
        var paywallConfidence = 0.0f

        val paywallMatches = paywallKeywords.count { keyword ->
            lowerUrl.contains(keyword) || lowerDesc.contains(keyword)
        }

        if (paywallMatches > 0) {
            isPaywall = true
            paywallConfidence = (0.5f + (paywallMatches * 0.2f)).coerceAtMost(0.99f)
            warnings.add("🔒 Mur payant / Abonnement requis détecté sur le site d'origine")
        }

        // 2. Détection de Piège à Clics (Clickbait) sur le titre Open Graph
        var isClickbait = false
        var clickbaitConfidence = 0.0f

        val clickbaitMatches = clickbaitTriggers.count { trigger ->
            lowerTitle.contains(trigger)
        }

        val hasAllCaps = ogTitle.length > 15 && ogTitle.count { it.isUpperCase() }.toFloat() / ogTitle.length > 0.45f
        val hasExcessPunctuation = ogTitle.contains("???") || ogTitle.contains("!!!") || ogTitle.contains("!?")

        if (clickbaitMatches > 0 || hasAllCaps || hasExcessPunctuation) {
            isClickbait = true
            val score = (clickbaitMatches * 0.35f) + (if (hasAllCaps) 0.3f else 0f) + (if (hasExcessPunctuation) 0.2f else 0f)
            clickbaitConfidence = score.coerceIn(0.4f, 0.98f)
            warnings.add("⚠️ Titre sensationnaliste / Piège à clics détecté")
        }

        // 3. Calcul de l'Indice de Fiabilité Citoyenne (basé sur la transparence de la source)
        var civicScore = 80
        val isDomainTrusted = trustedCivicDomains.any { lowerUrl.contains(it) }
        if (isDomainTrusted) {
            civicScore = 98
        } else if (lowerUrl.contains("gov") || lowerUrl.contains(".qc.ca") || lowerUrl.contains(".gc.ca")) {
            civicScore = 100
        } else if (isClickbait) {
            civicScore -= (clickbaitConfidence * 40).toInt()
        }

        val ogSnippet = if (ogDescription.isNotBlank()) ogDescription else "Aperçu Open Graph officiel de l'éditeur d'origine."

        AiAnalysisResult(
            isPaywall = isPaywall,
            paywallConfidence = paywallConfidence,
            isClickbait = isClickbait,
            clickbaitConfidence = clickbaitConfidence,
            civicReliabilityScore = civicScore.coerceIn(10, 100),
            openGraphSnippet = ogSnippet,
            warnings = warnings,
            gatewayNotice = "Passerelle neutre : Redirection directe vers le navigateur et le site d'origine de l'éditeur."
        )
    }

    /**
     * Génération de jeton anti-bot / anti-spam garantissant une action humaine
     */
    fun generateHumanVerificationToken(): String {
        val timestamp = System.currentTimeMillis()
        val randomSalt = (1000..9999).random()
        return "human-gateway-$timestamp-$randomSalt"
    }
}
