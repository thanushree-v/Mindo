from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel


class ReminderCreate(BaseModel):
    title: str
    message: str | None = None
    scheduled_at: datetime
    task_id: uuid.UUID | None = None


class ReminderUpdate(BaseModel):
    title: str | None = None
    message: str | None = None
    scheduled_at: datetime | None = None


class ReminderResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    task_id: uuid.UUID | None
    title: str
    message: str | None
    scheduled_at: datetime
    status: str
    sent_at: datetime | None
    retry_count: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ReminderListResponse(BaseModel):
    items: list[ReminderResponse]
    total: int
    page: int
    per_page: int
