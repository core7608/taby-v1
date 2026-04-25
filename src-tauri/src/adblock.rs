// src-tauri/src/adblock.rs
use crate::AppState;

pub fn init_rules(state: &tauri::State<AppState>) {
    // Rules are already loaded in main.rs
    // In production: download EasyList from https://easylist.to/easylist/easylist.txt
}
