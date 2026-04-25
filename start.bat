@echo off
chcp 65001 > nul
echo.
echo  ████████╗ █████╗ ██████╗ ██╗   ██╗
echo     ██╔══╝██╔══██╗██╔══██╗╚██╗ ██╔╝
echo     ██║   ███████║██████╔╝ ╚████╔╝
echo     ██║   ██╔══██║██╔══██╗  ╚██╔╝
echo     ██║   ██║  ██║██████╔╝   ██║
echo     ╚═╝   ╚═╝  ╚═╝╚═════╝    ╚═╝
echo.
echo  🌐 Taby Browser v1.0.0 - Development Mode
echo.

REM Check Node
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found! Install from https://nodejs.org
    pause
    exit /b 1
)

REM Check Cargo
where cargo >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Rust not found! Install from https://rustup.rs
    pause
    exit /b 1
)

echo ✅ Prerequisites OK

if not exist "node_modules" (
    echo 📦 Installing packages...
    call npm install
)

echo 🚀 Starting Taby Browser in development mode...
call npm run tauri:dev

pause
