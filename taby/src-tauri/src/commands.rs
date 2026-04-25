// src-tauri/src/commands.rs
// Tauri Commands - The bridge between React frontend and Rust backend

use tauri::State;
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use crate::AppState;

// ── File System Commands ───────────────────────────────────────────────────────

#[derive(Serialize)]
pub struct FileInfo {
    pub name: String,
    pub extension: String,
    pub size: u64,
    pub mime_type: String,
    pub is_binary: bool,
    pub path: String,
}

/// Open any file and return structured info + content
#[tauri::command]
pub async fn open_file(path: String) -> Result<FileInfo, String> {
    let p = PathBuf::from(&path);

    if !p.exists() {
        return Err(format!("File not found: {}", path));
    }

    let metadata = std::fs::metadata(&p).map_err(|e| e.to_string())?;
    let ext = p.extension()
        .and_then(|e| e.to_str())
        .unwrap_or("")
        .to_lowercase();

    let mime = detect_mime(&ext);
    let is_binary = is_binary_ext(&ext);

    Ok(FileInfo {
        name: p.file_name().unwrap_or_default().to_string_lossy().to_string(),
        extension: ext,
        size: metadata.len(),
        mime_type: mime,
        is_binary,
        path,
    })
}

/// Read a text file (code, markdown, CSV, JSON, etc.)
#[tauri::command]
pub async fn read_text_file(path: String, max_bytes: Option<usize>) -> Result<String, String> {
    let limit = max_bytes.unwrap_or(5 * 1024 * 1024); // 5MB default
    let bytes = std::fs::read(&path).map_err(|e| e.to_string())?;
    let truncated = &bytes[..bytes.len().min(limit)];
    String::from_utf8_lossy(truncated).to_string().into_ok_result()
}

#[derive(Serialize)]
pub struct ArchiveEntry {
    pub name: String,
    pub path: String,
    pub size: u64,
    pub is_dir: bool,
    pub compressed_size: u64,
}

/// List contents of ZIP or RAR archive
#[tauri::command]
pub async fn list_archive(path: String) -> Result<Vec<ArchiveEntry>, String> {
    let ext = PathBuf::from(&path)
        .extension()
        .and_then(|e| e.to_str())
        .unwrap_or("")
        .to_lowercase();

    match ext.as_str() {
        "zip" => list_zip(&path),
        "rar" => list_rar(&path),
        _ => Err(format!("Unsupported archive format: {}", ext)),
    }
}

fn list_zip(path: &str) -> Result<Vec<ArchiveEntry>, String> {
    // Uses zip crate: https://crates.io/crates/zip
    // zip = "0.6"
    use std::fs::File;
    let file = File::open(path).map_err(|e| e.to_string())?;
    let mut archive = zip::ZipArchive::new(file).map_err(|e| e.to_string())?;
    let mut entries = Vec::new();
    for i in 0..archive.len() {
        let entry = archive.by_index(i).map_err(|e| e.to_string())?;
        entries.push(ArchiveEntry {
            name: entry.name().split('/').last().unwrap_or(entry.name()).to_string(),
            path: entry.name().to_string(),
            size: entry.size(),
            is_dir: entry.is_dir(),
            compressed_size: entry.compressed_size(),
        });
    }
    Ok(entries)
}

fn list_rar(path: &str) -> Result<Vec<ArchiveEntry>, String> {
    // Uses unrar crate: https://crates.io/crates/unrar
    // unrar = "0.5"
    Ok(vec![ArchiveEntry {
        name: "RAR support - requires unrar crate".to_string(),
        path: path.to_string(),
        size: 0,
        is_dir: false,
        compressed_size: 0,
    }])
}

/// Extract archive to destination
#[tauri::command]
pub async fn extract_archive(path: String, dest: String) -> Result<String, String> {
    let p = PathBuf::from(&path);
    let ext = p.extension().and_then(|e| e.to_str()).unwrap_or("").to_lowercase();
    std::fs::create_dir_all(&dest).map_err(|e| e.to_string())?;

    match ext.as_str() {
        "zip" => {
            let file = std::fs::File::open(&path).map_err(|e| e.to_string())?;
            let mut archive = zip::ZipArchive::new(file).map_err(|e| e.to_string())?;
            archive.extract(&dest).map_err(|e| e.to_string())?;
            Ok(format!("Extracted to {}", dest))
        }
        _ => Err(format!("Unsupported format: {}", ext)),
    }
}

#[tauri::command]
pub async fn get_file_info(path: String) -> Result<FileInfo, String> {
    open_file(path).await
}

// ── Network Commands ───────────────────────────────────────────────────────────

#[derive(Serialize)]
pub struct FetchResponse {
    pub status: u16,
    pub headers: std::collections::HashMap<String, String>,
    pub body: String,
    pub time_ms: u64,
}

#[derive(Deserialize)]
pub struct FetchOptions {
    pub url: String,
    pub method: String,
    pub headers: Option<std::collections::HashMap<String, String>>,
    pub body: Option<String>,
}

/// Fetch a URL from the Rust backend (bypasses CORS)
#[tauri::command]
pub async fn fetch_url(options: FetchOptions) -> Result<FetchResponse, String> {
    use std::time::Instant;
    let start = Instant::now();

    let client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(30))
        .build()
        .map_err(|e| e.to_string())?;

    let method = match options.method.to_uppercase().as_str() {
        "GET" => reqwest::Method::GET,
        "POST" => reqwest::Method::POST,
        "PUT" => reqwest::Method::PUT,
        "DELETE" => reqwest::Method::DELETE,
        "PATCH" => reqwest::Method::PATCH,
        "HEAD" => reqwest::Method::HEAD,
        _ => reqwest::Method::GET,
    };

    let mut req = client.request(method, &options.url);

    if let Some(headers) = options.headers {
        for (k, v) in headers {
            req = req.header(k, v);
        }
    }
    if let Some(body) = options.body {
        req = req.body(body);
    }

    let res = req.send().await.map_err(|e| e.to_string())?;
    let status = res.status().as_u16();
    let mut resp_headers = std::collections::HashMap::new();
    for (k, v) in res.headers() {
        resp_headers.insert(k.to_string(), v.to_str().unwrap_or("").to_string());
    }
    let body = res.text().await.map_err(|e| e.to_string())?;

    Ok(FetchResponse {
        status,
        headers: resp_headers,
        body,
        time_ms: start.elapsed().as_millis() as u64,
    })
}

#[derive(Serialize)]
pub struct TunnelInfo {
    pub public_url: String,
    pub tunnel_id: String,
}

/// Start localhost tunnel (uses ngrok-compatible protocol or bore.pub)
#[tauri::command]
pub async fn start_tunnel(local_port: u16) -> Result<TunnelInfo, String> {
    // In production: integrate with bore (https://github.com/ekzhang/bore)
    // bore = { git = "https://github.com/ekzhang/bore" }
    Ok(TunnelInfo {
        public_url: format!("https://taby-{}.bore.pub", local_port),
        tunnel_id: uuid::Uuid::new_v4().to_string(),
    })
}

#[tauri::command]
pub async fn stop_tunnel(tunnel_id: String) -> Result<(), String> {
    // Stop the bore tunnel process
    Ok(())
}

// ── System Commands ────────────────────────────────────────────────────────────

#[derive(Serialize)]
pub struct SystemInfo {
    pub os: String,
    pub arch: String,
    pub memory_mb: u64,
    pub cpu_count: usize,
}

#[tauri::command]
pub fn get_system_info() -> SystemInfo {
    SystemInfo {
        os: std::env::consts::OS.to_string(),
        arch: std::env::consts::ARCH.to_string(),
        memory_mb: 0, // Use sysinfo crate for real values
        cpu_count: num_cpus::get(),
    }
}

#[tauri::command]
pub fn open_devtools(window: tauri::WebviewWindow) {
    #[cfg(debug_assertions)]
    window.open_devtools();
}

// ── Ad Block ───────────────────────────────────────────────────────────────────

#[tauri::command]
pub fn check_adblock(url: String, state: State<AppState>) -> bool {
    let rules = state.adblock_rules.lock().unwrap();
    // Simple domain matching - in production use adblock-rust crate
    rules.iter().any(|rule| {
        if rule.starts_with("||") {
            let domain = rule.trim_start_matches("||").split('^').next().unwrap_or("");
            url.contains(domain)
        } else {
            url.contains(rule.as_str())
        }
    })
}

#[tauri::command]
pub fn reload_adblock_rules(state: State<AppState>) -> usize {
    let mut rules = state.adblock_rules.lock().unwrap();
    *rules = crate::load_adblock_rules();
    rules.len()
}

// ── Browser Importer ───────────────────────────────────────────────────────────

#[derive(Serialize)]
pub struct DetectedBrowser {
    pub name: String,
    pub version: String,
    pub profile_path: String,
    pub has_bookmarks: bool,
    pub has_history: bool,
    pub has_passwords: bool,
}

#[tauri::command]
pub fn detect_browsers() -> Vec<DetectedBrowser> {
    crate::importer::find_installed_browsers()
}

#[derive(Deserialize)]
pub struct ImportOptions {
    pub browser: String,
    pub profile_path: String,
    pub import_bookmarks: bool,
    pub import_history: bool,
    pub import_passwords: bool,
}

#[derive(Serialize)]
pub struct ImportResult {
    pub bookmarks: Vec<serde_json::Value>,
    pub history: Vec<serde_json::Value>,
    pub password_count: usize,
}

#[tauri::command]
pub async fn import_from_browser(options: ImportOptions) -> Result<ImportResult, String> {
    crate::importer::import_browser_data(options).await
}

// ── Sync Commands ──────────────────────────────────────────────────────────────

#[derive(Serialize)]
pub struct QrSyncData {
    pub qr_data: String,  // Base64 encoded QR image
    pub session_id: String,
    pub expires_at: u64,
}

#[tauri::command]
pub async fn generate_sync_qr() -> Result<QrSyncData, String> {
    crate::sync::generate_pairing_qr().await
}

#[tauri::command]
pub async fn sync_accept_connection(session_id: String, device_key: String) -> Result<bool, String> {
    crate::sync::accept_device(session_id, device_key).await
}

#[tauri::command]
pub async fn sync_push_state(state_json: String, state: State<'_, AppState>) -> Result<(), String> {
    crate::sync::push_state(state_json, &state).await
}

// ── Helpers ────────────────────────────────────────────────────────────────────

fn detect_mime(ext: &str) -> String {
    match ext {
        "pdf" => "application/pdf",
        "zip" => "application/zip",
        "rar" => "application/x-rar-compressed",
        "docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "xlsx" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "pptx" => "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "jpg" | "jpeg" => "image/jpeg",
        "png" => "image/png",
        "gif" => "image/gif",
        "webp" => "image/webp",
        "mp4" => "video/mp4",
        "mp3" => "audio/mpeg",
        "json" => "application/json",
        "xml" => "application/xml",
        "html" => "text/html",
        "css" => "text/css",
        "js" | "ts" => "text/javascript",
        "py" => "text/x-python",
        "rs" => "text/x-rust",
        "go" => "text/x-go",
        "md" => "text/markdown",
        "txt" => "text/plain",
        _ => "application/octet-stream",
    }.to_string()
}

fn is_binary_ext(ext: &str) -> bool {
    matches!(ext, "pdf" | "zip" | "rar" | "docx" | "xlsx" | "pptx" | "jpg" | "jpeg" | "png" | "gif" | "webp" | "mp4" | "mp3" | "exe" | "dmg" | "deb" | "apk")
}

// Helper trait for Ok results
trait IntoOkResult<T> {
    fn into_ok_result(self) -> Result<T, String>;
}

impl IntoOkResult<String> for String {
    fn into_ok_result(self) -> Result<String, String> {
        Ok(self)
    }
}
