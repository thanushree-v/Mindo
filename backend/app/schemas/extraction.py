from __future__ import annotations

import uuid

from pydantic import BaseModel


class ExtractionPreviewRequest(BaseModel):
    capture_id: uuid.UUID | None = None
    transcript: str
    timezone: str = "UTC"


class ExtractionItemResponse(BaseModel):
    type: str
    title: str
    description: str = ""
    due_at: str | None = None
    reminder_at: str | None = None
    priority: str = "medium"
    category: str = "personal"
    needs_clarification: bool = False


class ExtractionResponse(BaseModel):
    items: list[ExtractionItemResponse]
    clarification_questions: list[str] = []
