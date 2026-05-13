#!/bin/bash

# ==============================================================================
# KALI WIFI AUDITOR - HYBRID ENGINE LAUNCHER
# ==============================================================================
# This script initializes the web-based auditor interface on your Kali machine.
# Author: AI Logic Engine (Antigravity)
# ==============================================================================

# ANSI Color Codes for the "Vibe"
CYAN='\033[0;36m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color
BOLD='\033[1m'

clear

echo -e "${CYAN}${BOLD}"
echo "  _  __      _ _  __      ___  ______ _         "
echo " | |/ /     | (_) \ \    / / |/ /  _ (_)        "
echo " | ' /  __ _| |_   \ \  / /| ' /| |_| |_        "
echo " |  <  / _\` | | |   \ \/ / |  < |  _| | |       "
echo " | . \| (_| | | |    \  /  | . \| | | | |       "
echo " |_|\_\\__,_|_|_|     \/   |_|\_\_| |_|_|       "
echo "                                              "
echo "            WIFI AUDITOR v2.4.9               "
echo -e "${NC}"

# 1. Root Check
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}[!] WARNING: This script is not running as root.${NC}"
   echo -e "    Some WiFi operations (monitor mode, deauth) require sudo permissions."
   echo -e "    The interface will still launch, but system commands may fail."
   echo ""
fi

# 2. Dependency Check
echo -e "${CYAN}[*] Checking environment dependencies...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}[X] Error: Node.js is not installed.${NC}"
    echo "    Install it with: sudo apt update && sudo apt install nodejs"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}[X] Error: npm is not installed.${NC}"
    echo "    Install it with: sudo apt update && sudo apt install npm"
    exit 1
fi

# 3. Project Initialization
if [ ! -d "node_modules" ]; then
    echo -e "${GREEN}[*] Installing toolkit modules (first run)...${NC}"
    npm install --quiet
fi

# 4. Script Permissions
echo -e "${CYAN}[*] Hardening script permissions in ./scripts/...${NC}"
chmod +x ./scripts/*.sh 2>/dev/null || echo -e "${RED}[!] No shell scripts found in ./scripts/${NC}"

# 5. Build Phase
echo -e "${GREEN}[*] Compiling Neural Visualizer & Backend Engine...${NC}"
npm run build --quiet

# 6. Final Launch
echo ""
echo -e "${BOLD}====================================================${NC}"
echo -e "${GREEN}${BOLD} INTERFACE DEPLOYED SUCCESSFULLY ${NC}"
echo -e "${BOLD} ACCESS URL: ${CYAN}http://localhost:3000${NC}"
echo -e "${BOLD}====================================================${NC}"
echo -e "Press ${RED}Ctrl+C${NC} to terminate the auditor engine."
echo ""

# Use production start
npm run start
