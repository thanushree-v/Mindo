from __future__ import annotations

import httpx
from fastapi import HTTPException, status

from app.config import settings
from app.providers.speech.tts_base import SynthesisResult, TTSProvider

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
    "auto": "auto",
}


class GnaniTimbreProvider(TTSProvider):
    """Text-to-speech using Gnani Timbre on the Vachana platform."""

    def __init__(
        self,
        api_url: str | None = None,
        api_key: str | None = None,
        timeout: float = 30.0,
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

        language_code = LANGUAGE_MAP.get(language, language)

        headers = {
            "X-API-Key-ID": self.api_key,
            "Content-Type": "application/json",
        }

        payload = {
            "text": text,
            "model": "timbre-v2.5",
            "voice": "Kaveri",
            "language": language_code,
            "speed": 1.0,
            "audio_config": {
                "sample_rate": 24000,
                "num_channels": 1,
                "sample_width": 2,
                "encoding": "linear_pcm",
                "container": "wav",
            },
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    self.api_url,
                    headers=headers,
                    json=payload,
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
                    detail=f"Timbre TTS error ({response.status_code}): {error_detail}",
                )

            content_type = response.headers.get("content-type", "audio/wav")

            return SynthesisResult(
                audio_bytes=response.content,
                content_type=content_type,
                provider="gnani_timbre",
            )

        except httpx.TimeoutException:
            raise HTTPException(
                status_code=status.HTTP_504_GATEWAY_TIMEOUT,
                detail="Timbre TTS request timed out",
            )
        except httpx.RequestError as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Timbre TTS connection error: {exc}",
            )
        except HTTPException:
            raise
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected Timbre TTS error: {exc}",
            )
