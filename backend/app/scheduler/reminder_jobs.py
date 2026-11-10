from __future__ import annotations

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.jobstores.sqlalchemy import SQLAlchemyJobStore

from app.config import settings
from app.database import AsyncSessionLocal
from app.models.reminder import Reminder
from app.models.notification import Notification

scheduler: AsyncIOScheduler | None = None


def init_scheduler() -> AsyncIOScheduler:
    global scheduler
    # APScheduler 3.x SQLAlchemyJobStore needs a sync connection string.
    # Convert postgresql+asyncpg:// to postgresql+psycopg2://
    sync_url = settings.DATABASE_URL.replace(
        "postgresql+asyncpg://", "postgresql+psycopg2://"
    )

    jobstores = {
        "default": SQLAlchemyJobStore(url=sync_url, tablename="apscheduler_jobs"),
    }

    scheduler = AsyncIOScheduler(jobstores=jobstores)
    return scheduler


async def send_reminder(reminder_id: str) -> None:
    """Job function called by APScheduler when a reminder fires."""
    import uuid
    from datetime import datetime, timezone
    from sqlalchemy import select

    async with AsyncSessionLocal() as db:
        result = await db.execute(
            select(Reminder).where(Reminder.id == uuid.UUID(reminder_id))
        )
        reminder = result.scalar_one_or_none()

        if reminder is None or reminder.status == "cancelled":
            return

        try:
            # Create in-app notification
            notif = Notification(
                user_id=reminder.user_id,
                reminder_id=reminder.id,
                title=reminder.title,
                message=reminder.message or f"Reminder: {reminder.title}",
            )
            db.add(notif)

            reminder.status = "sent"
            reminder.sent_at = datetime.now(timezone.utc)

            await db.commit()
        except Exception:
            await db.rollback()
            reminder.status = "failed"
            reminder.retry_count = (reminder.retry_count or 0) + 1
            await db.commit()

            # Retry up to 3 times with increasing delay
            if reminder.retry_count < 3:
                from datetime import timedelta

                retry_time = datetime.now(timezone.utc) + timedelta(
                    minutes=reminder.retry_count * 2
                )
                schedule_reminder_job(str(reminder.id), retry_time)


def schedule_reminder_job(reminder_id: str, run_date) -> None:
    """Schedule a reminder to fire at the given time."""
    if scheduler is None:
        return

    job_id = f"reminder_{reminder_id}"

    # Remove existing job if any
    try:
        scheduler.remove_job(job_id)
    except Exception:
        pass

    scheduler.add_job(
        send_reminder,
        "date",
        run_date=run_date,
        id=job_id,
        args=[reminder_id],
        replace_existing=True,
    )


def cancel_reminder_job(reminder_id: str) -> None:
    """Cancel a scheduled reminder job."""
    if scheduler is None:
        return
    try:
        scheduler.remove_job(f"reminder_{reminder_id}")
    except Exception:
        pass


async def reconcile_reminders() -> None:
    """On startup, ensure all pending/scheduled reminders have jobs."""
    from datetime import datetime, timezone
    from sqlalchemy import select

    async with AsyncSessionLocal() as db:
        result = await db.execute(
            select(Reminder).where(
                Reminder.status.in_(["pending", "scheduled"]),
                Reminder.scheduled_at > datetime.now(timezone.utc),
            )
        )
        reminders = result.scalars().all()

        for reminder in reminders:
            schedule_reminder_job(str(reminder.id), reminder.scheduled_at)
            if reminder.status == "pending":
                reminder.status = "scheduled"

        await db.commit()
