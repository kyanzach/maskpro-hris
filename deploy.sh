#!/bin/bash
# ═══════════════════════════════════════════
# HRIS MASKPRO — Deploy Script
# Builds the Vite frontend, syncs to production,
# and restarts the PM2 process.
# ═══════════════════════════════════════════

set -euo pipefail

# ── Config ──
SERVER_IP="167.71.217.49"
SERVER_USER="root"
SERVER_PATH="/var/www/hris.maskpro.ph"
PM2_PROCESS="hris-api"
DOMAIN="hris.maskpro.ph"
SSH_OPTS="-o StrictHostKeyChecking=no -o ConnectTimeout=10"

# Source credentials from .ssh_helper.sh (gitignored — never committed)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$SCRIPT_DIR/.ssh_helper.sh" ]; then
  source "$SCRIPT_DIR/.ssh_helper.sh" __source_only 2>/dev/null || true
  # .ssh_helper.sh exports SSHPASS — we just need it in env
  SERVER_PASS="$SSHPASS"
else
  SERVER_PASS="${DEPLOY_SSH_PASS:-}"
  if [ -z "$SERVER_PASS" ]; then
    echo -e "\033[0;31m[✗]\033[0m Missing .ssh_helper.sh and no DEPLOY_SSH_PASS env var set."
    echo "   Create .ssh_helper.sh with: export SSHPASS=\"your-password\""
    exit 1
  fi
  export SSHPASS="$SERVER_PASS"
fi

# ── Colors ──
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log()  { echo -e "${BLUE}[deploy]${NC} $1"; }
ok()   { echo -e "${GREEN}[✓]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
err()  { echo -e "${RED}[✗]${NC} $1"; exit 1; }

# ── Parse Arguments ──
DO_BUILD=false
DO_SYNC=false
DO_RESTART=false
DO_FRONTEND=false
DO_BACKEND=false
DO_SETUP_NGINX=false
DO_ALL=false

if [ $# -eq 0 ]; then
  DO_ALL=true
fi

while [[ $# -gt 0 ]]; do
  case "$1" in
    --build)    DO_BUILD=true ;;
    --sync)     DO_SYNC=true ;;
    --restart)  DO_RESTART=true ;;
    --frontend) DO_FRONTEND=true ;;
    --backend)  DO_BACKEND=true ;;
    --setup-nginx) DO_SETUP_NGINX=true ;;
    *)          err "Unknown option: $1\nUsage: ./deploy.sh [--build] [--sync] [--restart] [--frontend] [--backend] [--setup-nginx]" ;;
  esac
  shift
done

# Full deploy = build + sync + restart
if $DO_ALL; then
  DO_BUILD=true
  DO_SYNC=true
  DO_RESTART=true
fi

# Frontend = build + sync dist/
if $DO_FRONTEND; then
  DO_BUILD=true
  DO_SYNC=true
fi

# Backend = sync server/ + restart
if $DO_BACKEND; then
  DO_SYNC=true
  DO_RESTART=true
fi

# ═══════════════════════════════════════════
# Step 1: Pre-flight checks
# ═══════════════════════════════════════════
log "Pre-flight checks..."
if ! command -v sshpass &> /dev/null; then
    err "sshpass could not be found. Please install it first:\nbrew install hudochenkov/sshpass/sshpass"
fi

SSHPASS="$SERVER_PASS" sshpass -e ssh $SSH_OPTS ${SERVER_USER}@${SERVER_IP} "echo ok" >/dev/null 2>&1 || err "Cannot SSH to ${SERVER_IP}. Check credentials."
ok "SSH connection successful"

# ═══════════════════════════════════════════
# Step 2: Build
# ═══════════════════════════════════════════
if $DO_BUILD; then
  log "Building Vite production bundle..."
  npm run build || err "Build failed!"
  ok "Build complete"
fi

# ═══════════════════════════════════════════
# Step 3: Sync
# ═══════════════════════════════════════════
if $DO_SYNC; then
  log "Syncing files to ${SERVER_IP}:${SERVER_PATH}..."

  # Ensure server directory exists
  SSHPASS="$SERVER_PASS" sshpass -e ssh $SSH_OPTS ${SERVER_USER}@${SERVER_IP} "mkdir -p ${SERVER_PATH}"

  # Sync dist/ (frontend build) — NO --delete (additive only)
  if [ -d "dist" ]; then
    SSHPASS="$SERVER_PASS" sshpass -e rsync -avz \
      -e "ssh $SSH_OPTS" \
      dist/ \
      ${SERVER_USER}@${SERVER_IP}:${SERVER_PATH}/dist/ \
      || err "Failed to sync dist/"
    ok "Synced dist/"
  fi

  # Sync server/ (backend) — NO --delete, exclude .env
  SSHPASS="$SERVER_PASS" sshpass -e rsync -avz \
    --exclude '.env' --exclude 'node_modules' \
    -e "ssh $SSH_OPTS" \
    server/ \
    ${SERVER_USER}@${SERVER_IP}:${SERVER_PATH}/server/ \
    || err "Failed to sync server/"
  ok "Synced server/"

  # Sync package.json and package-lock.json
  SSHPASS="$SERVER_PASS" sshpass -e rsync -avz \
    -e "ssh $SSH_OPTS" \
    package.json package-lock.json \
    ${SERVER_USER}@${SERVER_IP}:${SERVER_PATH}/ \
    || err "Failed to sync package files"
  ok "Synced package*.json"

  # Sync CHANGELOG.md if exists
  if [ -f CHANGELOG.md ]; then
    SSHPASS="$SERVER_PASS" sshpass -e rsync -avz -e "ssh $SSH_OPTS" CHANGELOG.md ${SERVER_USER}@${SERVER_IP}:${SERVER_PATH}/
    ok "Synced CHANGELOG.md"
  fi

  # Install production dependencies on server
  log "Installing production dependencies on server..."
  SSHPASS="$SERVER_PASS" sshpass -e ssh $SSH_OPTS ${SERVER_USER}@${SERVER_IP} "cd ${SERVER_PATH}/server && npm install --production" || err "npm install failed on server"
  ok "Server dependencies installed"
fi

# ═══════════════════════════════════════════
# Step 4: Restart PM2
# ═══════════════════════════════════════════
if $DO_RESTART; then
  log "Restarting PM2 process: ${PM2_PROCESS}..."

  # Check if PM2 process exists
  if SSHPASS="$SERVER_PASS" sshpass -e ssh $SSH_OPTS ${SERVER_USER}@${SERVER_IP} "pm2 describe ${PM2_PROCESS} > /dev/null 2>&1"; then
    SSHPASS="$SERVER_PASS" sshpass -e ssh $SSH_OPTS ${SERVER_USER}@${SERVER_IP} "cd ${SERVER_PATH}/server && pm2 restart ${PM2_PROCESS} --update-env" || err "PM2 restart failed"
  else
    warn "PM2 process '${PM2_PROCESS}' not found. Starting new process..."
    SSHPASS="$SERVER_PASS" sshpass -e ssh $SSH_OPTS ${SERVER_USER}@${SERVER_IP} "cd ${SERVER_PATH}/server && NODE_ENV=production pm2 start index.js --name ${PM2_PROCESS}" || err "PM2 start failed"
    SSHPASS="$SERVER_PASS" sshpass -e ssh $SSH_OPTS ${SERVER_USER}@${SERVER_IP} "pm2 save" || warn "PM2 save failed"
  fi
  ok "PM2 process restarted"

  # Wait for startup
  sleep 2

  # Verify
  log "Verifying deployment..."
  HTTP_STATUS=$(SSHPASS="$SERVER_PASS" sshpass -e ssh $SSH_OPTS ${SERVER_USER}@${SERVER_IP} "curl -sk -o /dev/null -w '%{http_code}' http://127.0.0.1:3001/api/health" 2>/dev/null || echo "000")

  if [ "$HTTP_STATUS" = "200" ]; then
    ok "Deployment verified: http://127.0.0.1:3001/api/health → HTTP ${HTTP_STATUS}"
  else
    warn "Health check returned HTTP ${HTTP_STATUS}. Check PM2 logs: ssh ${SERVER_USER}@${SERVER_IP} 'pm2 logs ${PM2_PROCESS} --lines 20'"
  fi
fi

# ═══════════════════════════════════════════
# Step 5: Setup Nginx (one-time)
# ═══════════════════════════════════════════
if $DO_SETUP_NGINX; then
  log "Setting up Nginx config for ${DOMAIN}..."

  NGINX_CONF="server {
    listen 80;
    server_name ${DOMAIN};
    
    # Root directory for Vite static files
    root ${SERVER_PATH}/dist;
    index index.html;

    # Serve static files, fallback to index.html for React Router
    location / {
        try_files \\\$uri \\\$uri/ /index.html;
    }

    # Proxy API requests to Node.js backend
    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \\\$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \\\$host;
        proxy_set_header X-Real-IP \\\$remote_addr;
        proxy_set_header X-Forwarded-For \\\$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \\\$scheme;
        proxy_cache_bypass \\\$http_upgrade;
    }
}"

  echo "$NGINX_CONF" | SSHPASS="$SERVER_PASS" sshpass -e ssh $SSH_OPTS ${SERVER_USER}@${SERVER_IP} "cat > /etc/nginx/sites-available/hris.maskpro.ph"
  SSHPASS="$SERVER_PASS" sshpass -e ssh $SSH_OPTS ${SERVER_USER}@${SERVER_IP} "ln -sf /etc/nginx/sites-available/hris.maskpro.ph /etc/nginx/sites-enabled/hris.maskpro.ph"
  SSHPASS="$SERVER_PASS" sshpass -e ssh $SSH_OPTS ${SERVER_USER}@${SERVER_IP} "nginx -t && systemctl reload nginx" || err "Nginx config test failed"
  ok "Nginx configured for ${DOMAIN}"

  warn "Run 'certbot --nginx -d ${DOMAIN}' on the server for SSL"
fi

echo ""
ok "Deploy complete! 🚀"
