from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.providers.dependencies import get_llm_provider
from app.providers.llm.base import LLMProvider
from app.schemas.extraction import (
    ExtractionItemResponse,
    ExtractionPreviewRequest,
    ExtractionResponse,
)
from app.services import extraction_service

router = APIRouter(prefix="/api/v1/extractions", tags=["extractions"])


@router.post("/preview", response_model=ExtractionResponse)
async def preview_extraction(
    body: ExtractionPreviewRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    llm_provider: LLMProvider = Depends(get_llm_provider),
):
    result = await extraction_service.extract_from_transcript(
        db=db,
        transcript=body.transcript,
        tz=body.timezone,
        capture_id=body.capture_id,
        llm_provider=llm_provider,
    )
    return ExtractionResponse(
        items=[
            ExtractionItemResponse(
                type=item.type,
                title=item.title,
                description=item.description,
                due_at=item.due_at,
                reminder_at=item.reminder_at,
                priority=item.priority,
                category=item.category,
                needs_clarification=item.needs_clarification,
            )
            for item in result.items
        ],
        clarification_questions=result.clarification_questions,
    )
