from __future__ import annotations

import httpx
from fastapi import HTTPException, status

from app.config import settings
from app.providers.speech.tts_base import SynthesisResult, TTSProvider


class GnaniTimbreProvider(TTSProvider):
    """Text-to-speech provider using Gnani Timbre API."""

    def __init__(
        self,
        api_url: str | None = None,
        api_key: str | None = None,
        timeout: float = 15.0,
    ) -> None:
        self.api_url = api_url or settings.GNANI_TIMBRE_API_URL
        self.api_key = api_key or settings.GNANI_TIMBRE_API_KEY
        self.timeout = timeout

    async def synthesize(self, text: str, language: str = "en") -> SynthesisResult:
        if not self.api_url or not self.api_key:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Gnani Timbre TTS provider is not configured",
            )

        headers = {
            "apikey": self.api_key,
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        payload = {
            "text": text,
            "language": language,
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    self.api_url,
                    headers=headers,
                    json=payload,
                )

            if response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail=f"TTS provider returned status {response.status_code}: {response.text[:200]}",
                )

            content_type = response.headers.get("content-type", "audio/wav")

            if "json" in content_type:
                result = response.json()
                import base64

                audio_b64 = (
                    result.get("audio")
                    or result.get("data", {}).get("audio", "")
                    or result.get("audioContent", "")
                )
                if audio_b64:
                    audio_bytes = base64.b64decode(audio_b64)
                    return SynthesisResult(
                        audio_bytes=audio_bytes,
                        content_type="audio/wav",
                        provider="gnani_timbre",
                    )
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="TTS provider returned empty audio",
                )

            return SynthesisResult(
                audio_bytes=response.content,
                content_type=content_type,
                provider="gnani_timbre",
            )

        except httpx.TimeoutException:
            raise HTTPException(
                status_code=status.HTTP_504_GATEWAY_TIMEOUT,
                detail="TTS provider request timed out",
            )
        except httpx.RequestError as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"TTS provider connection error: {exc}",
            )
        except HTTPException:
            raise
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected TTS error: {exc}",
            )
