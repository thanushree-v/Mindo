from __future__ import annotations

import httpx
from fastapi import HTTPException, status

from app.config import settings
from app.providers.speech.base import SpeechProvider, TranscriptionResult


class GnaniPrismaProvider(SpeechProvider):
    """Speech-to-text provider using the Gnani Prisma API."""

    def __init__(
        self,
        api_url: str | None = None,
        api_key: str | None = None,
        timeout: float = 30.0,
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
                detail="Gnani speech provider is not configured",
            )

        headers = {
            "apikey": self.api_key,
            "Authorization": f"Bearer {self.api_key}",
        }

        # Determine content type from audio bytes (default to webm)
        content_type = "audio/webm"
        if audio_bytes[:4] == b"RIFF":
            content_type = "audio/wav"
        elif audio_bytes[:3] == b"ID3" or audio_bytes[:2] == b"\xff\xfb":
            content_type = "audio/mpeg"

        files = {
            "file": ("audio.webm", audio_bytes, content_type),
        }
        data = {
            "language": language,
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
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail=f"Speech provider returned status {response.status_code}: {response.text[:200]}",
                )

            result = response.json()

            # Try common response field names
            transcript = (
                result.get("transcript")
                or result.get("text")
                or result.get("result", {}).get("transcript", "")
                or result.get("data", {}).get("transcript", "")
            )

            if not transcript:
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="Speech provider returned empty transcript",
                )

            confidence = result.get("confidence") or result.get(
                "result", {}
            ).get("confidence")

            return TranscriptionResult(
                transcript=transcript,
                language=language,
                confidence=float(confidence) if confidence is not None else None,
                provider="gnani",
            )

        except httpx.TimeoutException:
            raise HTTPException(
                status_code=status.HTTP_504_GATEWAY_TIMEOUT,
                detail="Speech provider request timed out",
            )
        except httpx.RequestError as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Speech provider connection error: {exc}",
            )
        except HTTPException:
            raise
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected error during transcription: {exc}",
            )
