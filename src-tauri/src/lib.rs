mod atoll;

use atoll::{broadcast_to_atoll, detect_atoll_support, AtollActivityPayload, AtollStatusResult};
use serde::{Deserialize, Serialize};
use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Manager,
};

#[derive(Debug, Serialize, Deserialize)]
pub struct MetadataInspection {
    pub url: String,
    pub is_trusted_source: bool,
    pub civic_score: u32,
    pub gateway_notice: String,
}

#[tauri::command]
fn inspect_metadata_neutral(url: String) -> MetadataInspection {
    let lower = url.to_lowercase();
    let is_trusted = lower.contains("radio-canada.ca")
        || lower.contains("lapresse.ca")
        || lower.contains("ledevoir.com")
        || lower.contains("lemonde.fr")
        || lower.contains("quebec.ca")
        || lower.contains("canada.ca")
        || lower.contains("meteo.gc.ca");

    let score = if is_trusted { 98 } else { 80 };

    MetadataInspection {
        url,
        is_trusted_source: is_trusted,
        civic_score: score,
        gateway_notice: "Passerelle Neutre Desktop : Redirection directe vers le navigateur sans hébergement ni scraping (Art. 29 LDA)".into(),
    }
}

#[tauri::command]
fn get_app_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

#[tauri::command]
fn get_atoll_status() -> AtollStatusResult {
    detect_atoll_support()
}

#[tauri::command]
fn emit_atoll_activity(title: String, subtitle: String, score: u32, status: String, link: Option<String>) -> bool {
    broadcast_to_atoll(AtollActivityPayload {
        title,
        subtitle,
        score,
        status,
        link,
    })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .invoke_handler(tauri::generate_handler![
            inspect_metadata_neutral,
            get_app_version,
            get_atoll_status,
            emit_atoll_activity
        ])
        .setup(|app| {
            // Setup System Tray Menu
            let quit_i = MenuItem::with_id(app, "quit", "Quitter LienLibre", true, None::<&str>)?;
            let show_i = MenuItem::with_id(app, "show", "Ouvrir l'application", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&show_i, &quit_i])?;

            let _tray = TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&menu)
                .show_menu_on_left_click(false)
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "quit" => {
                        app.exit(0);
                    }
                    "show" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                    _ => {}
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        let app = tray.app_handle();
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                })
                .build(app)?;

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running LienLibre Tauri desktop application");
}
