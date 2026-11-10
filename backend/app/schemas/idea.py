from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel


class IdeaCreate(BaseModel):
    title: str
    description: str | None = None
    capture_id: uuid.UUID | None = None


class IdeaUpdate(BaseModel):
    title: str | None = None
    description: str | None = None


class IdeaResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    title: str
    description: str | None
    capture_id: uuid.UUID | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class IdeaListResponse(BaseModel):
    items: list[IdeaResponse]
    total: int
    page: int
    per_page: int
