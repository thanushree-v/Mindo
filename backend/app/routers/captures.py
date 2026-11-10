from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, Query, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.providers.dependencies import get_speech_provider
from app.providers.speech.base import SpeechProvider
from app.schemas.capture import CaptureResponse, TextCaptureRequest
from app.services import capture_service

router = APIRouter(prefix="/api/v1/captures", tags=["captures"])


@router.post("/voice", response_model=CaptureResponse)
async def create_voice_capture(
    file: UploadFile,
    language: str = Query("en", max_length=10),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    speech_provider: SpeechProvider = Depends(get_speech_provider),
):
    audio_bytes = await file.read()
    capture = await capture_service.create_voice_capture(
        db=db,
        user_id=current_user.id,
        audio_bytes=audio_bytes,
        language=language,
        speech_provider=speech_provider,
    )
    return capture


@router.post("/text", response_model=CaptureResponse)
async def create_text_capture(
    body: TextCaptureRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    capture = await capture_service.create_text_capture(
        db=db,
        user_id=current_user.id,
        text=body.text,
    )
    return capture


@router.get("/", response_model=list[CaptureResponse])
async def list_captures(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    captures, _total = await capture_service.get_captures(
        db=db,
        user_id=current_user.id,
        page=page,
        per_page=per_page,
    )
    return captures


@router.get("/{capture_id}", response_model=CaptureResponse)
async def get_capture(
    capture_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    capture = await capture_service.get_capture(
        db=db,
        user_id=current_user.id,
        capture_id=capture_id,
    )
    return capture
