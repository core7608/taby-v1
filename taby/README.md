# 🌐 Taby Browser

<div align="center">
  <img src="src-tauri/icons/icon.svg" width="120" height="120" alt="Taby Logo"/>
  
  **متصفح ثوري مفتوح المصدر — سريع · خاص · أدوات مطورين مدمجة**
  
  [![Build](https://img.shields.io/github/actions/workflow/status/taby-browser/taby/build.yml?style=flat-square&label=Build)](https://github.com/taby-browser/taby/actions)
  [![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
  [![Tauri](https://img.shields.io/badge/Tauri-2.0-orange?style=flat-square)](https://tauri.app)
  [![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square)](https://react.dev)
</div>

---

## ✨ المميزات

### 🎯 للمستخدمين (35+ ميزة)
- 🛡️ **Ad Blocker MAX** — حجب إعلانات كامل مع EasyList
- 🎭 **Fingerprint Masking** — إخفاء بصمة المتصفح
- 🔐 **Taby Vault** — خزنة كلمات مرور AES-256
- 💤 **Tab Hibernation** — توفير الذاكرة تلقائياً
- 📂 **Universal Viewer** — فتح PDF, ZIP, DOCX, PY, و50+ نوع ملف
- 📱 **Taby Sync QR** — مزامنة الأجهزة بدون حساب
- 🌙 **Dark/Light Mode** — تبديل سهل
- 🔏 **Stealth Tabs** — تابس تختفي عند فقد التركيز
- 🌐 **Built-in VPN** — WireGuard للشبكات العامة
- ⌨️ **Command Palette** — `Ctrl+K` للوصول السريع
- 🔄 **Auto Updates** — تحديث تلقائي مع تحقق من التوقيع
- 🏠 **Smart New Tab** — ساعة، إشارات مرجعية، وصول سريع

### 🛠️ للمطورين (15+ ميزة)
- 🖥️ **DevTools Suite** — Console, Network, Storage
- 🔌 **API Tester Pro** — مثل Postman مدمج
- 🧠 **AI Error Explain** — شرح الأخطاء بالذكاء الاصطناعي
- 🌍 **Localhost Tunnel** — رابط عام للمشاريع المحلية
- 💻 **Universal Code Viewer** — تلوين كود 50+ لغة
- 📐 **CSS Visual Editor** — تعديل CSS مرئي

### 📦 التطبيقات المدمجة
| التطبيق | الوصف |
|---------|-------|
| 🎥 **Taby Meet** | مؤتمرات فيديو كاملة |
| 📝 **Taby Office** | Writer + Sheets + Slides |
| 📄 **Taby PDF** | عارض PDF مع تعليقات |
| 🔐 **Taby Vault** | مدير كلمات مرور |
| 📱 **Taby Sync** | مزامنة QR |
| 🗒️ **Taby Notes** | ملاحظات Markdown |
| ⬇️ **Download Manager** | مدير تنزيلات |
| 🔌 **API Tester Pro** | عميل API |

---

## 🚀 التثبيت السريع

### متطلبات التطوير
```bash
# Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Node.js 20+
nvm install 20

# Tauri CLI
cargo install tauri-cli --version '^2.0'
```

### تشغيل المشروع
```bash
git clone https://github.com/taby-browser/taby.git
cd taby
npm install
npm run tauri:dev
```

### البناء لمنصة محددة
```bash
# Windows (.exe + .msi)
npm run tauri:build

# macOS (.dmg)
npm run tauri:build

# Linux (.deb + .AppImage)
npm run tauri:build

# Android (.apk)
npm run tauri:build:android

# iOS (.ipa)
npm run tauri:build:ios
```

---

## 🏗️ هيكل المشروع

```
taby/
├── src/                          # React Frontend
│   ├── App.jsx                   # Root component
│   ├── stores/
│   │   └── browserStore.js       # Zustand state management
│   ├── components/
│   │   ├── Browser/              # Core browser UI
│   │   │   ├── BrowserChrome.jsx # Main layout
│   │   │   ├── TabBar.jsx        # Chrome-like tabs
│   │   │   ├── Toolbar.jsx       # URL bar + controls
│   │   │   ├── NewTabPage.jsx    # New tab page
│   │   │   ├── Sidebar.jsx       # Bookmarks/History/Settings
│   │   │   ├── AutoUpdater.jsx   # ← Auto-update notifications
│   │   │   └── CommandPalette.jsx
│   │   ├── Apps/                 # Built-in applications
│   │   │   ├── TabyAppsHub.jsx   # Apps launcher
│   │   │   ├── TabyMeet.jsx      # Video conferencing
│   │   │   ├── TabyOffice.jsx    # Writer+Sheets+Slides
│   │   │   ├── TabyPdfViewer.jsx # PDF viewer
│   │   │   ├── TabyVault.jsx     # Password manager
│   │   │   ├── TabySync.jsx      # QR Sync
│   │   │   ├── TabyNotes.jsx     # Markdown notes
│   │   │   ├── TabyDownloadManager.jsx
│   │   │   └── TabyApiTester.jsx
│   │   └── DevTools/
│   │       └── DevToolsPanel.jsx # F12 DevTools
│   └── styles/globals.css
│
├── src-tauri/                    # Rust Backend (Tauri)
│   ├── src/
│   │   ├── main.rs               # Entry point + tray
│   │   ├── commands.rs           # File/Network commands
│   │   ├── vault.rs              # AES-256 password vault
│   │   ├── updater.rs            # ← Auto-update logic
│   │   ├── adblock.rs            # Ad blocking engine
│   │   ├── importer.rs           # Browser data import
│   │   ├── sync.rs               # QR sync protocol
│   │   └── universal_viewer.rs   # File format handler
│   ├── icons/                    # All platform icons
│   ├── capabilities/
│   │   └── default.json          # Tauri v2 permissions
│   ├── Cargo.toml                # Rust dependencies
│   └── tauri.conf.json           # Tauri configuration
│
├── .github/
│   └── workflows/
│       └── build.yml             # CI/CD for all platforms
│
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## 🔧 المعمارية التقنية

```
React (UI Layer)
      ↕ invoke() / listen()
Tauri Bridge (IPC)
      ↕
Rust Backend (Tauri Commands)
      ↕
OS APIs (Files, Network, Keychain, TPM)
```

### الأداء
- **RAM:** ~80MB (مقارنة بـ 400MB لكروم)
- **حجم الملف:** ~8MB (Windows exe)
- **وقت التشغيل:** < 1 ثانية

---

## 🤝 المساهمة

```bash
# Fork → Clone → Branch → Commit → PR
git checkout -b feature/my-feature
git commit -m "feat: add amazing feature"
git push origin feature/my-feature
```

## 📄 الرخصة

MIT License — مفتوح المصدر للجميع ✨
