from __future__ import annotations

import uuid

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.capture import Capture
from app.providers.speech.base import SpeechProvider


async def create_voice_capture(
    db: AsyncSession,
    user_id: uuid.UUID,
    audio_bytes: bytes,
    language: str,
    speech_provider: SpeechProvider,
) -> Capture:
    """Transcribe audio and create a voice capture record."""
    result = await speech_provider.transcribe(audio_bytes, language)

    capture = Capture(
        user_id=user_id,
        transcript=result.transcript,
        source="voice",
        language=result.language,
    )
    db.add(capture)
    await db.flush()
    return capture


async def create_text_capture(
    db: AsyncSession,
    user_id: uuid.UUID,
    text: str,
) -> Capture:
    """Create a text capture record."""
    capture = Capture(
        user_id=user_id,
        transcript=text,
        source="text",
        language="en",
    )
    db.add(capture)
    await db.flush()
    return capture


async def get_captures(
    db: AsyncSession,
    user_id: uuid.UUID,
    page: int = 1,
    per_page: int = 20,
) -> tuple[list[Capture], int]:
    """List captures for a user with pagination."""
    # Count total
    count_query = select(func.count()).select_from(Capture).where(
        Capture.user_id == user_id
    )
    total_result = await db.execute(count_query)
    total = total_result.scalar_one()

    # Fetch page
    query = (
        select(Capture)
        .where(Capture.user_id == user_id)
        .order_by(Capture.created_at.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
    )
    result = await db.execute(query)
    captures = list(result.scalars().all())

    return captures, total


async def get_capture(
    db: AsyncSession,
    user_id: uuid.UUID,
    capture_id: uuid.UUID,
) -> Capture:
    """Get a single capture with ownership check."""
    query = select(Capture).where(
        Capture.id == capture_id,
        Capture.user_id == user_id,
    )
    result = await db.execute(query)
    capture = result.scalar_one_or_none()

    if capture is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Capture not found",
        )
    return capture
