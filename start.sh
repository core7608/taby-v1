#!/bin/bash
# ════════════════════════════════════════════════════════
#   Taby Browser - Quick Start Script
#   يشغّل المتصفح في وضع التطوير
# ════════════════════════════════════════════════════════

set -e

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo -e "${BLUE}  ████████╗ █████╗ ██████╗ ██╗   ██╗${NC}"
echo -e "${BLUE}     ██╔══╝██╔══██╗██╔══██╗╚██╗ ██╔╝${NC}"
echo -e "${BLUE}     ██║   ███████║██████╔╝ ╚████╔╝ ${NC}"
echo -e "${BLUE}     ██║   ██╔══██║██╔══██╗  ╚██╔╝  ${NC}"
echo -e "${BLUE}     ██║   ██║  ██║██████╔╝   ██║   ${NC}"
echo -e "${BLUE}     ╚═╝   ╚═╝  ╚═╝╚═════╝    ╚═╝   ${NC}"
echo ""
echo -e "${GREEN}  🌐 Taby Browser v1.0.0 - Development Mode${NC}"
echo ""

# Check prerequisites
check_cmd() {
  if ! command -v $1 &> /dev/null; then
    echo -e "${RED}❌ $1 is not installed.${NC}"
    echo -e "   Install: $2"
    exit 1
  fi
}

echo "🔍 Checking prerequisites..."
check_cmd node "https://nodejs.org"
check_cmd npm "https://nodejs.org"
check_cmd cargo "https://rustup.rs"
echo -e "${GREEN}✅ All prerequisites found${NC}"
echo ""

# Install dependencies
if [ ! -d "node_modules" ]; then
  echo "📦 Installing npm packages..."
  npm install
  echo -e "${GREEN}✅ npm packages installed${NC}"
fi

# Platform info
OS=$(uname -s)
echo -e "🖥️  Platform: ${YELLOW}$OS${NC}"
echo ""

# Build options
echo "🔨 Build options:"
echo "  1) npm run tauri:dev     — Development mode (hot reload)"
echo "  2) npm run tauri:build   — Production build"
echo ""
echo -e "${YELLOW}Starting development mode...${NC}"
echo ""

npm run tauri:dev
