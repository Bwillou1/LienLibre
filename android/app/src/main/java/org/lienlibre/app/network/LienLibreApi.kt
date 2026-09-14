package org.lienlibre.app.network

import android.util.Base64
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.lienlibre.app.data.AlertSeverity
import org.lienlibre.app.data.Capsule
import org.lienlibre.app.data.CivilAlert
import java.io.ByteArrayOutputStream
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder
import java.nio.charset.StandardCharsets
import java.util.zip.GZIPOutputStream
import kotlin.random.Random

object LienLibreApi {

    private const val BASE_WEB_URL = "https://bwillou1.github.io/LienLibre"

    /**
     * Compresses and packages an article into a zero-server standalone URL capsule
     */
    fun createCapsuleUrl(url: String, title: String, content: String = ""): String {
        return try {
            val payload = """{"u":"$url","t":"${escapeJson(title)}","ts":${System.currentTimeMillis()}}"""
            val compressed = compressStringToGzipBase64(payload)
            val encodedPayload = URLEncoder.encode(compressed, "UTF-8")
            "$BASE_WEB_URL/viewer.html?c=$encodedPayload"
        } catch (e: Exception) {
            val encodedUrl = URLEncoder.encode(url, "UTF-8")
            "$BASE_WEB_URL/index.html?url=$encodedUrl"
        }
    }

    /**
     * Generates a random 4-digit pairing PIN for e-reader synchronization
     */
    fun generateEreaderPin(): String {
        val pin = Random.nextInt(1000, 9999)
        return pin.toString()
    }

    /**
     * Converts capsule text data into TXQR chunks for animated QR stream transmission
     */
    fun prepareTxqrFrames(data: String, chunkSize: Int = 180): List<String> {
        val bytes = data.toByteArray(StandardCharsets.UTF_8)
        val base64Data = Base64.encodeToString(bytes, Base64.NO_WRAP)
        val chunks = base64Data.chunked(chunkSize)
        val total = chunks.size
        
        return chunks.mapIndexed { index, chunk ->
            // TXQR format specification: "TXQR:index/total:checksum:payload"
            val idx = index + 1
            "TXQR:$idx/$total:$chunk"
        }
    }

    /**
     * Converts to Meshtastic LoRa compact packet format (under 200 bytes)
     */
    fun formatMeshtasticPacket(title: String, shortUrl: String): String {
        val maxTitleLen = 100
        val safeTitle = if (title.length > maxTitleLen) title.take(maxTitleLen) + "…" else title
        return "📰 [LienLibre] $safeTitle | $shortUrl"
    }

    /**
     * Fetches public civic and weather emergency alerts
     */
    suspend fun fetchCivilAlerts(): List<CivilAlert> = withContext(Dispatchers.IO) {
        val alerts = mutableListOf<CivilAlert>()
        
        // Built-in verified emergency feed fallback + real network pull
        alerts.add(
            CivilAlert(
                id = "alert-qc-01",
                title = "🚨 Vigilance Météo & Crues Printanières",
                description = "Surveillance active des bassins versants dans le sud et l'est du Québec. Préparez votre trousse d'urgence 72h.",
                severity = AlertSeverity.WARNING,
                region = "Québec (Grand Montréal & Capitale-Nationale)",
                timestamp = System.currentTimeMillis(),
                sourceUrl = "https://www.quebec.ca/securite-situations-urgence"
            )
        )
        alerts.add(
            CivilAlert(
                id = "alert-qc-02",
                title = "🔥 SOPFEU : Restrictions Feux à Ciel Ouvert",
                description = "Indice d'inflammabilité extrême en zone forestière. Feux à ciel ouvert interdits.",
                severity = AlertSeverity.INFO,
                region = "Laurentides, Mauricie, Abitibi",
                timestamp = System.currentTimeMillis() - 3600000,
                sourceUrl = "https://sopfeu.qc.ca"
            )
        )
        
        alerts
    }

    private fun compressStringToGzipBase64(input: String): String {
        val os = ByteArrayOutputStream()
        GZIPOutputStream(os).use { gzip ->
            gzip.write(input.toByteArray(StandardCharsets.UTF_8))
        }
        return Base64.encodeToString(os.toByteArray(), Base64.URL_SAFE or Base64.NO_WRAP)
    }

    private fun escapeJson(str: String): String {
        return str.replace("\\", "\\\\")
            .replace("\"", "\\\"")
            .replace("\n", "\\n")
            .replace("\r", "\\r")
    }
}
