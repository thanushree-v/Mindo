from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel


class NoteCreate(BaseModel):
    content: str
    capture_id: uuid.UUID | None = None


class NoteUpdate(BaseModel):
    content: str | None = None


class NoteResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    content: str
    capture_id: uuid.UUID | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class NoteListResponse(BaseModel):
    items: list[NoteResponse]
    total: int
    page: int
    per_page: int
