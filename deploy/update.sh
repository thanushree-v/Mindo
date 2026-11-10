#!/bin/bash
set -e

# ============================================================
# MINDDO Quick Update Script
# Run as root: sudo bash update.sh
# Pulls latest code, rebuilds, and restarts services
# ============================================================

APP_DIR="/var/www/minddo"

echo "============================================"
echo "  MINDDO Update"
echo "============================================"
echo ""

# Pull latest code
echo "[1/5] Pulling latest code..."
cd "$APP_DIR"
git pull

# Update Python dependencies
echo "[2/5] Updating Python dependencies..."
cd "$APP_DIR/backend"
./venv/bin/pip install -r requirements.txt --quiet

# Run migrations
echo "[3/5] Running database migrations..."
./venv/bin/alembic upgrade head

# Rebuild frontend
echo "[4/5] Rebuilding frontend..."
cd "$APP_DIR/frontend"
npm install --silent
npm run build

# Restart backend
echo "[5/5] Restarting backend service..."
systemctl restart minddo-api

sleep 2

echo ""
echo "============================================"
echo "  Update Complete!"
echo "============================================"

# Check status
if systemctl is-active --quiet minddo-api; then
    echo "  minddo-api: RUNNING"
else
    echo "  minddo-api: FAILED"
    echo "  Check logs: journalctl -u minddo-api -n 50"
fi

# Quick health check
if curl -sf http://localhost:8000/health > /dev/null 2>&1; then
    echo "  Health check: OK"
else
    echo "  Health check: FAILED"
fi

echo ""
