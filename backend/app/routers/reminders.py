from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.reminder import (
    ReminderCreate,
    ReminderListResponse,
    ReminderResponse,
    ReminderUpdate,
)
from app.services import reminder_service
from app.scheduler.reminder_jobs import schedule_reminder_job, cancel_reminder_job

router = APIRouter(prefix="/api/v1/reminders", tags=["reminders"])


@router.post("/", response_model=ReminderResponse, status_code=status.HTTP_201_CREATED)
async def create_reminder(
    body: ReminderCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    reminder = await reminder_service.create_reminder(
        db=db,
        user_id=current_user.id,
        data=body,
    )
    schedule_reminder_job(str(reminder.id), reminder.scheduled_at)
    return reminder


@router.get("/", response_model=ReminderListResponse)
async def list_reminders(
    reminder_status: str | None = Query(None, alias="status"),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    reminders, total = await reminder_service.get_reminders(
        db=db,
        user_id=current_user.id,
        reminder_status=reminder_status,
        page=page,
        per_page=per_page,
    )
    return ReminderListResponse(
        items=reminders,
        total=total,
        page=page,
        per_page=per_page,
    )


@router.get("/{reminder_id}", response_model=ReminderResponse)
async def get_reminder(
    reminder_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    reminder = await reminder_service.get_reminder(
        db=db,
        user_id=current_user.id,
        reminder_id=reminder_id,
    )
    return reminder


@router.patch("/{reminder_id}", response_model=ReminderResponse)
async def update_reminder(
    reminder_id: uuid.UUID,
    body: ReminderUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    reminder = await reminder_service.update_reminder(
        db=db,
        user_id=current_user.id,
        reminder_id=reminder_id,
        data=body,
    )
    # Reschedule the job if scheduled_at was updated
    if body.scheduled_at is not None:
        schedule_reminder_job(str(reminder.id), reminder.scheduled_at)
    return reminder


@router.delete("/{reminder_id}", status_code=status.HTTP_204_NO_CONTENT)
async def cancel_reminder(
    reminder_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    await reminder_service.cancel_reminder(
        db=db,
        user_id=current_user.id,
        reminder_id=reminder_id,
    )
    cancel_reminder_job(str(reminder_id))
    return Response(status_code=status.HTTP_204_NO_CONTENT)
