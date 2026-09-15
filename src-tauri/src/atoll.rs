use serde::{Deserialize, Serialize};
use std::process::Command;

#[derive(Debug, Serialize, Deserialize)]
pub struct AtollActivityPayload {
    pub title: String,
    pub subtitle: String,
    pub score: u32,
    pub status: String, // "processing", "verified", "blocked", "alert"
    pub link: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AtollStatusResult {
    pub is_atoll_installed: bool,
    pub is_supported_macos: bool,
    pub os_version: String,
}

/**
 * Détecte la version de macOS et la disponibilité de l'application Atoll.
 * Compatible avec les anciennes versions (macOS 10.15 Catalina, Big Sur 11, Monterey 12)
 * ainsi que macOS 13+ (Ventura, Sonoma, Sequoia).
 */
pub fn detect_atoll_support() -> AtollStatusResult {
    #[cfg(target_os = "macos")]
    {
        // 1. Détection de la version de macOS via sw_vers
        let os_ver = Command::new("sw_vers")
            .arg("-productVersion")
            .output()
            .map(|o| String::from_utf8_lossy(&o.stdout).trim().to_string())
            .unwrap_or_else(|_| "Unknown".to_string());

        // 2. Vérification de l'existence de l'application Atoll dans /Applications
        let atoll_exists = std::path::Path::new("/Applications/Atoll.app").exists()
            || std::path::Path::new(&format!("{}/Applications/Atoll.app", std::env::var("HOME").unwrap_or_default())).exists();

        let is_macos_13_plus = os_ver
            .split('.')
            .next()
            .and_then(|v| v.parse::<u32>().ok())
            .map(|major| major >= 13)
            .unwrap_or(false);

        AtollStatusResult {
            is_atoll_installed: atoll_exists,
            is_supported_macos: is_macos_13_plus,
            os_version: os_ver,
        }
    }

    #[cfg(not(target_os = "macos"))]
    {
        AtollStatusResult {
            is_atoll_installed: false,
            is_supported_macos: false,
            os_version: "Non-macOS".to_string(),
        }
    }
}

/**
 * Envoie une Live Activity / Sneak Peek vers Atoll (Dynamic Island)
 * avec fallback automatique sur les notifications natives et System Tray
 * pour toutes les versions de macOS antérieures ou machines sans Atoll.
 */
pub fn broadcast_to_atoll(payload: AtollActivityPayload) -> bool {
    #[cfg(target_os = "macos")]
    {
        let status_info = detect_atoll_support();

        // 1. Si Atoll est présent, émettre via URL Scheme atoll:// (AtollExtensionKit compatible)
        if status_info.is_atoll_installed {
            let encoded_title = urlencoding_simple(&payload.title);
            let encoded_sub = urlencoding_simple(&payload.subtitle);
            let atoll_url = format!(
                "atoll://live-activity?title={}&subtitle={}&score={}&status={}&source=LienLibre",
                encoded_title, encoded_sub, payload.score, payload.status
            );

            let res = Command::new("open")
                .arg("-g") // En arrière-plan sans voler le focus
                .arg(&atoll_url)
                .output();

            if let Ok(out) = res {
                if out.status.success() {
                    return true;
                }
            }
        }

        // 2. Fallback pour anciennes versions de macOS (Big Sur, Monterey, Catalina)
        // et machines sans Atoll : Notification système élégante avec son
        let icon_prefix = match payload.status.as_str() {
            "verified" => "✅",
            "blocked" => "🛑",
            "alert" => "🚨",
            _ => "🔗",
        };

        let script = format!(
            "display notification \"{}\" with title \"{} LienLibre\" subtitle \"{}\" sound name \"Hero\"",
            payload.subtitle.replace('\"', "\\\""),
            icon_prefix,
            payload.title.replace('\"', "\\\"")
        );

        let _ = Command::new("osascript")
            .arg("-e")
            .arg(script)
            .output();

        true
    }

    #[cfg(not(target_os = "macos"))]
    {
        let _ = payload;
        false
    }
}

fn urlencoding_simple(s: &str) -> String {
    let mut encoded = String::new();
    for b in s.bytes() {
        match b {
            b'a'..=b'z' | b'A'..=b'Z' | b'0'..=b'9' | b'-' | b'_' | b'.' | b'~' => {
                encoded.push(b as char);
            }
            b' ' => encoded.push_str("%20"),
            _ => {
                encoded.push_str(&format!("%{:02X}", b));
            }
        }
    }
    encoded
}
