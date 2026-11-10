from __future__ import annotations

from fastapi import APIRouter, Depends
from fastapi.responses import Response
from pydantic import BaseModel

from app.dependencies import get_current_user
from app.models.user import User
from app.providers.dependencies import get_tts_provider
from app.providers.speech.tts_base import TTSProvider

router = APIRouter(prefix="/api/v1/tts", tags=["tts"])


class SynthesizeRequest(BaseModel):
    text: str
    language: str = "en"


@router.post("/synthesize")
async def synthesize(
    body: SynthesizeRequest,
    current_user: User = Depends(get_current_user),
    tts_provider: TTSProvider = Depends(get_tts_provider),
):
    result = await tts_provider.synthesize(body.text, body.language)

    if not result.audio_bytes:
        return {"status": "no_audio", "provider": result.provider}

    return Response(
        content=result.audio_bytes,
        media_type=result.content_type,
        headers={"X-TTS-Provider": result.provider},
    )
