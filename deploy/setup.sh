#!/bin/bash
set -e

# ============================================================
# MINDDO VPS Setup Script
# Run as root: sudo bash setup.sh
# Tested on Ubuntu 22.04/24.04 and Debian 12
# ============================================================

REPO_URL=""  # Set this before running, or pass as argument
APP_DIR="/var/www/minddo"
ENV_DIR="/etc/minddo"
DB_NAME="minddo"
DB_USER="minddo"
DB_PASS=$(openssl rand -base64 16)
SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(32))" 2>/dev/null || openssl rand -base64 32)

if [ "$1" != "" ]; then
    REPO_URL="$1"
fi

if [ -z "$REPO_URL" ]; then
    echo "Usage: sudo bash setup.sh <github-repo-url>"
    echo "Example: sudo bash setup.sh https://github.com/yourusername/Mindo.git"
    exit 1
fi

echo "============================================"
echo "  MINDDO Server Setup"
echo "============================================"
echo ""

# ---- 1. System packages ----
echo "[1/10] Installing system packages..."
apt update -y
apt install -y \
    python3 python3-pip python3-venv \
    postgresql postgresql-contrib \
    nginx certbot python3-certbot-nginx \
    git curl

# Install Node.js 18+ via NodeSource
if ! command -v node &> /dev/null || [ "$(node -v | cut -d. -f1 | tr -d 'v')" -lt 18 ]; then
    echo "Installing Node.js 18..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt install -y nodejs
fi

echo "  Python: $(python3 --version)"
echo "  Node: $(node --version)"
echo "  PostgreSQL: $(psql --version | head -1)"
echo "  Nginx: $(nginx -v 2>&1)"

# ---- 2. Create minddo user ----
echo "[2/10] Creating minddo system user..."
if ! id -u minddo &>/dev/null; then
    useradd --system --shell /bin/false --home "$APP_DIR" minddo
fi

# ---- 3. PostgreSQL setup ----
echo "[3/10] Setting up PostgreSQL..."
systemctl enable postgresql
systemctl start postgresql

sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" | grep -q 1 || \
    sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';"

sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" | grep -q 1 || \
    sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"

echo "  Database: $DB_NAME"
echo "  User: $DB_USER"

# ---- 4. Clone repository ----
echo "[4/10] Cloning repository..."
if [ -d "$APP_DIR" ]; then
    echo "  Directory exists, pulling latest..."
    cd "$APP_DIR"
    git pull
else
    git clone "$REPO_URL" "$APP_DIR"
fi
chown -R minddo:minddo "$APP_DIR"

# ---- 5. Backend setup ----
echo "[5/10] Setting up Python backend..."
cd "$APP_DIR/backend"
python3 -m venv venv
./venv/bin/pip install --upgrade pip
./venv/bin/pip install -r requirements.txt

# ---- 6. Environment file ----
echo "[6/10] Creating environment config..."
mkdir -p "$ENV_DIR"

if [ ! -f "$ENV_DIR/.env" ]; then
    cat > "$ENV_DIR/.env" << ENVEOF
DATABASE_URL=postgresql+asyncpg://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME
SECRET_KEY=$SECRET_KEY
ACCESS_TOKEN_EXPIRE_DAYS=7
GNANI_API_KEY=
GNANI_API_URL=
LLM_API_KEY=
LLM_API_URL=
CORS_ORIGINS=http://$(hostname -I | awk '{print $1}')
ENVEOF
    echo "  Created $ENV_DIR/.env"
    echo "  IMPORTANT: Edit $ENV_DIR/.env to add your API keys!"
else
    echo "  $ENV_DIR/.env already exists, skipping"
fi

# Also symlink .env to project root so Alembic can find it
ln -sf "$ENV_DIR/.env" "$APP_DIR/.env"

# ---- 7. Database migrations ----
echo "[7/10] Running database migrations..."
cd "$APP_DIR/backend"

# Generate migration if none exists
if [ ! "$(ls -A alembic/versions/*.py 2>/dev/null)" ]; then
    ./venv/bin/alembic revision --autogenerate -m "initial_tables"
fi

./venv/bin/alembic upgrade head

# ---- 8. Frontend build ----
echo "[8/10] Building frontend..."
cd "$APP_DIR/frontend"
npm install
npm run build

# Clean node_modules to save disk space (optional)
# rm -rf node_modules

# ---- 9. Nginx config ----
echo "[9/10] Configuring Nginx..."
cp "$APP_DIR/deploy/nginx.conf" /etc/nginx/sites-available/minddo
ln -sf /etc/nginx/sites-available/minddo /etc/nginx/sites-enabled/minddo

# Remove default site if it exists
rm -f /etc/nginx/sites-enabled/default

nginx -t
systemctl enable nginx
systemctl restart nginx

# ---- 10. Systemd service ----
echo "[10/10] Setting up backend service..."
cp "$APP_DIR/deploy/minddo-api.service" /etc/systemd/system/minddo-api.service
systemctl daemon-reload
systemctl enable minddo-api
systemctl start minddo-api

# Wait a moment for startup
sleep 3

# ---- Summary ----
echo ""
echo "============================================"
echo "  MINDDO Setup Complete!"
echo "============================================"
echo ""
echo "  App directory:  $APP_DIR"
echo "  Config file:    $ENV_DIR/.env"
echo "  Database:       $DB_NAME (user: $DB_USER)"
echo "  DB password:    $DB_PASS"
echo ""
echo "  Backend:  http://localhost:8000/health"
echo "  Frontend: http://$(hostname -I | awk '{print $1}')"
echo ""
echo "  SAVE THIS DATABASE PASSWORD SOMEWHERE SAFE!"
echo ""

# Check service status
echo "Service status:"
systemctl is-active minddo-api && echo "  minddo-api: RUNNING" || echo "  minddo-api: FAILED (check: journalctl -u minddo-api -n 50)"
systemctl is-active nginx && echo "  nginx: RUNNING" || echo "  nginx: FAILED"
systemctl is-active postgresql && echo "  postgresql: RUNNING" || echo "  postgresql: FAILED"

echo ""
echo "Next steps:"
echo "  1. Edit $ENV_DIR/.env to add your Gnani and LLM API keys"
echo "  2. Restart backend: sudo systemctl restart minddo-api"
echo "  3. (Optional) Set up SSL: sudo certbot --nginx -d yourdomain.com"
echo "  4. Open the app in your browser!"
echo ""
