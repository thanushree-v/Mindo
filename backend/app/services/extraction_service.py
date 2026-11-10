from __future__ import annotations

import json
import uuid
from dataclasses import asdict
from datetime import datetime, timezone

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.extraction_log import ExtractionLog
from app.providers.llm.base import ExtractionResult, LLMProvider


async def extract_from_transcript(
    db: AsyncSession,
    transcript: str,
    tz: str,
    capture_id: uuid.UUID | None,
    llm_provider: LLMProvider,
) -> ExtractionResult:
    """Extract structured items from a transcript using the LLM provider."""
    current_time = datetime.now(timezone.utc).isoformat()

    result = await llm_provider.extract(transcript, current_time, tz)

    # Log the extraction
    log = ExtractionLog(
        capture_id=capture_id,
        raw_response=transcript,
        parsed_json=json.dumps(asdict(result), default=str),
    )
    db.add(log)
    await db.flush()

    return result
