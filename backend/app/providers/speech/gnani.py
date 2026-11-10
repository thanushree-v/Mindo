from __future__ import annotations

import httpx
from fastapi import HTTPException, status

from app.config import settings
from app.providers.speech.base import SpeechProvider, TranscriptionResult

LANGUAGE_MAP = {
    "en": "en-IN",
    "hi": "hi-IN",
    "ta": "ta-IN",
    "te": "te-IN",
    "kn": "kn-IN",
    "ml": "ml-IN",
    "mr": "mr-IN",
    "bn": "bn-IN",
    "gu": "gu-IN",
    "pa": "pa-IN",
    "auto": "indic-auto",
}


def _detect_content_type(audio_bytes: bytes) -> tuple[str, str]:
    if audio_bytes[:4] == b"RIFF":
        return "audio/wav", "recording.wav"
    if audio_bytes[:3] == b"ID3" or audio_bytes[:2] == b"\xff\xfb":
        return "audio/mpeg", "recording.mp3"
    if audio_bytes[:4] == b"OggS":
        return "audio/ogg", "recording.ogg"
    if audio_bytes[:4] == b"fLaC":
        return "audio/flac", "recording.flac"
    return "audio/webm", "recording.webm"


class GnaniPrismaProvider(SpeechProvider):
    """Speech-to-text using Gnani Prisma on the Vachana platform."""

    def __init__(
        self,
        api_url: str | None = None,
        api_key: str | None = None,
        timeout: float = 60.0,
    ) -> None:
        self.api_url = api_url or settings.GNANI_API_URL
        self.api_key = api_key or settings.GNANI_API_KEY
        self.timeout = timeout

    async def transcribe(
        self, audio_bytes: bytes, language: str = "en"
    ) -> TranscriptionResult:
        if not self.api_url or not self.api_key:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Gnani Prisma provider is not configured",
            )

        language_code = LANGUAGE_MAP.get(language, language)
        content_type, filename = _detect_content_type(audio_bytes)

        headers = {
            "X-API-Key-ID": self.api_key,
        }

        files = {
            "audio_file": (filename, audio_bytes, content_type),
        }
        data = {
            "language_code": language_code,
            "model": "prisma-v3.0",
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    self.api_url,
                    headers=headers,
                    files=files,
                    data=data,
                )

            if response.status_code != 200:
                error_detail = response.text[:300]
                try:
                    error_json = response.json()
                    error_detail = error_json.get("message", error_detail)
                except Exception:
                    pass
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail=f"Prisma STT error ({response.status_code}): {error_detail}",
                )

            result = response.json()

            transcript = result.get("transcript", "")
            if not transcript:
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="Prisma returned empty transcript",
                )

            detected_lang = result.get("detected_language_code", language_code)

            return TranscriptionResult(
                transcript=transcript,
                language=detected_lang,
                confidence=None,
                provider="gnani_prisma",
            )

        except httpx.TimeoutException:
            raise HTTPException(
                status_code=status.HTTP_504_GATEWAY_TIMEOUT,
                detail="Prisma STT request timed out",
            )
        except httpx.RequestError as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Prisma STT connection error: {exc}",
            )
        except HTTPException:
            raise
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected Prisma STT error: {exc}",
            )
