from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel


class TextCaptureRequest(BaseModel):
    text: str


class CaptureResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    transcript: str | None
    source: str
    language: str
    created_at: datetime

    model_config = {"from_attributes": True}
