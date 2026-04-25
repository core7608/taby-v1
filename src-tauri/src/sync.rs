// src-tauri/src/sync.rs
use serde::{Deserialize, Serialize};
use crate::AppState;

#[derive(Serialize)]
pub struct PairingQr {
    pub qr_data: String,
    pub session_id: String,
    pub expires_at: u64,
}

pub async fn generate_pairing_qr() -> Result<super::commands::QrSyncData, String> {
    let session_id = format!("taby-sync-{}", std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap_or_default().as_secs());
    let expires_at = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap_or_default().as_secs() + 300;
    Ok(super::commands::QrSyncData {
        qr_data: format!("taby://sync?session={}&key=ENCRYPTED_KEY", session_id),
        session_id,
        expires_at,
    })
}

pub async fn accept_device(_session_id: String, _device_key: String) -> Result<bool, String> {
    Ok(true)
}

pub async fn push_state(_state_json: String, _state: &tauri::State<'_, AppState>) -> Result<(), String> {
    Ok(())
}
