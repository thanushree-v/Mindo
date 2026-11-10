from __future__ import annotations

import uuid
from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.reminder import Reminder
from app.schemas.reminder import ReminderCreate, ReminderUpdate


async def create_reminder(
    db: AsyncSession,
    user_id: uuid.UUID,
    data: ReminderCreate,
) -> Reminder:
    """Create a new reminder. Validates that scheduled_at is in the future."""
    if data.scheduled_at <= datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="scheduled_at must be in the future",
        )

    reminder = Reminder(
        user_id=user_id,
        title=data.title,
        message=data.message,
        scheduled_at=data.scheduled_at,
        task_id=data.task_id,
    )
    db.add(reminder)
    await db.flush()
    return reminder


async def get_reminders(
    db: AsyncSession,
    user_id: uuid.UUID,
    reminder_status: str | None = None,
    page: int = 1,
    per_page: int = 20,
) -> tuple[list[Reminder], int]:
    """List reminders with optional status filter and pagination."""
    base = select(Reminder).where(Reminder.user_id == user_id)

    if reminder_status:
        base = base.where(Reminder.status == reminder_status)

    # Count total matching
    count_query = select(func.count()).select_from(base.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar_one()

    # Order and paginate
    base = base.order_by(Reminder.scheduled_at.asc())
    base = base.offset((page - 1) * per_page).limit(per_page)

    result = await db.execute(base)
    reminders = list(result.scalars().all())

    return reminders, total


async def get_reminder(
    db: AsyncSession,
    user_id: uuid.UUID,
    reminder_id: uuid.UUID,
) -> Reminder:
    """Get a single reminder with ownership check."""
    query = select(Reminder).where(
        Reminder.id == reminder_id,
        Reminder.user_id == user_id,
    )
    result = await db.execute(query)
    reminder = result.scalar_one_or_none()

    if reminder is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reminder not found",
        )
    return reminder


async def update_reminder(
    db: AsyncSession,
    user_id: uuid.UUID,
    reminder_id: uuid.UUID,
    data: ReminderUpdate,
) -> Reminder:
    """Update an existing reminder. Validates scheduled_at if changed."""
    reminder = await get_reminder(db, user_id, reminder_id)

    update_data = data.model_dump(exclude_unset=True)

    if "scheduled_at" in update_data and update_data["scheduled_at"] is not None:
        if update_data["scheduled_at"] <= datetime.now(timezone.utc):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="scheduled_at must be in the future",
            )

    for field, value in update_data.items():
        setattr(reminder, field, value)

    await db.flush()
    return reminder


async def cancel_reminder(
    db: AsyncSession,
    user_id: uuid.UUID,
    reminder_id: uuid.UUID,
) -> Reminder:
    """Cancel a reminder by setting its status to cancelled."""
    reminder = await get_reminder(db, user_id, reminder_id)
    reminder.status = "cancelled"
    await db.flush()
    return reminder
