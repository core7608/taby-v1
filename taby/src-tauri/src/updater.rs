// src-tauri/src/updater.rs
// Auto-updater module for Taby Browser
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct UpdateInfo {
    pub version: String,
    pub notes: String,
    pub pub_date: String,
    pub url: String,
    pub signature: String,
}

#[derive(Serialize)]
pub struct UpdateStatus {
    pub available: bool,
    pub current_version: String,
    pub latest_version: Option<String>,
    pub notes: Option<String>,
    pub downloading: bool,
    pub progress: f64,
}

#[tauri::command]
pub async fn check_for_updates() -> Result<UpdateStatus, String> {
    let current = env!("CARGO_PKG_VERSION").to_string();
    // In production, tauri-plugin-updater handles this automatically
    Ok(UpdateStatus {
        available: false,
        current_version: current,
        latest_version: None,
        notes: None,
        downloading: false,
        progress: 0.0,
    })
}

#[tauri::command]
pub async fn install_update() -> Result<(), String> {
    // tauri-plugin-updater will restart the app after install
    Ok(())
}
