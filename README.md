# MINDDO

> Your thoughts, organised.

MINDDO is a voice-first personal productivity web app that turns everyday spoken thoughts into organised tasks, ideas, notes and reminders.

Speak naturally — MINDDO transcribes, identifies intent, extracts structured records, and lets you confirm before saving. Reminders fire at the time you asked.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite, Tailwind CSS |
| Backend | Python FastAPI |
| Database | PostgreSQL |
| ORM | SQLAlchemy (async) |
| Migrations | Alembic |
| Speech-to-Text | Gnani Prisma |
| AI Extraction | LLM with structured JSON output |
| Auth | JWT (access tokens) |
| Reminders | APScheduler |
| Notifications | In-app (polling) |

## Project Structure

```
Mindo/
├── backend/          # FastAPI application
│   ├── app/
│   │   ├── models/       # SQLAlchemy models
│   │   ├── schemas/      # Pydantic schemas
│   │   ├── routers/      # API route handlers
│   │   ├── services/     # Business logic
│   │   ├── providers/    # Speech & LLM adapters
│   │   └── scheduler/    # APScheduler reminder engine
│   └── alembic/          # Database migrations
├── frontend/         # React application
│   └── src/
│       ├── pages/        # Page components
│       ├── components/   # UI components
│       ├── api/          # API client
│       ├── context/      # React contexts
│       └── hooks/        # Custom hooks
├── deploy/           # Deployment configs
└── docs/             # Documentation
```

## Local Development Setup

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 15+

### 1. Database

```bash
psql -U postgres -c "CREATE DATABASE minddo;"
```

### 2. Environment

```bash
cp .env.example .env
# Edit .env with your database credentials and API keys
```

Leave `GNANI_API_KEY` and `LLM_API_KEY` empty to use mock providers (returns canned responses for testing the UI).

### 3. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Linux/Mac
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:5173 (proxies `/api/*` to backend)

## API Overview

All endpoints under `/api/v1`, JWT auth required.

| Group | Endpoints |
|-------|----------|
| Auth | `POST /auth/register`, `POST /auth/login`, `GET /auth/me` |
| Captures | `POST /captures/voice`, `POST /captures/text`, `GET /captures` |
| Extractions | `POST /extractions/preview` |
| Tasks | CRUD + `POST /{id}/complete`, `POST /{id}/postpone` |
| Ideas | CRUD + `POST /{id}/convert-to-task` |
| Notes | CRUD |
| Reminders | CRUD (cancel via DELETE) |
| Notifications | `GET /`, `GET /unread-count`, `POST /{id}/read`, `POST /read-all` |

## Deployment

See `deploy/` for Nginx config, systemd service, and setup scripts.

```bash
# On your VPS:
git clone https://github.com/YOUR_USERNAME/Mindo.git /var/www/minddo
cd /var/www/minddo/deploy
sudo bash setup.sh
```

## License

All rights reserved.
