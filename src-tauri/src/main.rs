#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod universal_viewer;
mod vault;
mod sync;
mod adblock;
mod importer;
mod updater;

use commands::*;
use vault::*;
use updater::*;
use tauri::Manager;
use std::sync::Mutex;

pub struct AppState {
    pub adblock_rules: Mutex<Vec<String>>,
    pub vault_key: Mutex<Option<Vec<u8>>>,
    pub sync_key: Mutex<Option<Vec<u8>>>,
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .manage(AppState {
            adblock_rules: Mutex::new(load_adblock_rules()),
            vault_key: Mutex::new(None),
            sync_key: Mutex::new(None),
        })
        .invoke_handler(tauri::generate_handler![
            open_file, read_text_file, list_archive, extract_archive, get_file_info,
            fetch_url, start_tunnel, stop_tunnel,
            vault_init, vault_store, vault_retrieve, vault_delete, vault_list,
            generate_sync_qr, sync_accept_connection, sync_push_state,
            check_adblock, reload_adblock_rules,
            detect_browsers, import_from_browser,
            get_system_info, open_devtools,
            check_for_updates, install_update,
        ])
        .setup(|app| {
            let state = app.state::<AppState>();
            adblock::init_rules(&state);
            #[cfg(desktop)]
            setup_tray(app)?;
            // Auto-check updates on launch (after 3s delay)
            let app_handle = app.handle().clone();
            tauri::async_runtime::spawn(async move {
                tokio::time::sleep(tokio::time::Duration::from_secs(3)).await;
                let _ = app_handle.emit("check-update", ());
            });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running Taby");
}

#[cfg(desktop)]
fn setup_tray(app: &tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    use tauri::menu::{MenuBuilder, MenuItemBuilder};
    use tauri::tray::TrayIconBuilder;
    let quit = MenuItemBuilder::new("Quit Taby").id("quit").build(app)?;
    let show = MenuItemBuilder::new("Show Browser").id("show").build(app)?;
    let menu = MenuBuilder::new(app).items(&[&show, &quit]).build()?;
    TrayIconBuilder::new()
        .menu(&menu)
        .tooltip("Taby Browser")
        .on_menu_event(|app, event| match event.id().as_ref() {
            "quit" => app.exit(0),
            "show" => {
                if let Some(w) = app.get_webview_window("main") {
                    let _ = w.show();
                    let _ = w.set_focus();
                }
            }
            _ => {}
        })
        .build(app)?;
    Ok(())
}

fn load_adblock_rules() -> Vec<String> {
    vec![
        "||doubleclick.net^".into(),
        "||googlesyndication.com^".into(),
        "||googletagmanager.com^".into(),
        "||facebook.com/tr^".into(),
        "||analytics.google.com^$third-party".into(),
        "||ads.youtube.com^".into(),
        "||scorecardresearch.com^".into(),
        "||outbrain.com^".into(),
        "||taboola.com^".into(),
        "||quantserve.com^".into(),
    ]
}
