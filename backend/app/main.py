from __future__ import annotations

from contextlib import asynccontextmanager
from collections.abc import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers.auth import router as auth_router
from app.routers.captures import router as captures_router
from app.routers.extractions import router as extractions_router
from app.routers.tasks import router as tasks_router
from app.routers.ideas import router as ideas_router
from app.routers.notes import router as notes_router
from app.routers.reminders import router as reminders_router
from app.routers.notifications import router as notifications_router
from app.routers.tts import router as tts_router
from app.scheduler.reminder_jobs import init_scheduler, reconcile_reminders


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    # Startup: initialise scheduler and reconcile pending reminders
    sched = init_scheduler()
    sched.start()
    await reconcile_reminders()
    yield
    # Shutdown: clean up scheduler
    sched.shutdown()


app = FastAPI(title="MINDDO API", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.CORS_ORIGINS.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(captures_router)
app.include_router(extractions_router)
app.include_router(tasks_router)
app.include_router(ideas_router)
app.include_router(notes_router)
app.include_router(reminders_router)
app.include_router(notifications_router)
app.include_router(tts_router)


@app.get("/health")
async def health():
    return {"status": "ok"}
