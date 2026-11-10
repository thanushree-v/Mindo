from __future__ import annotations

from app.providers.speech.tts_base import SynthesisResult, TTSProvider


class MockTTSProvider(TTSProvider):
    """Mock TTS provider that returns empty audio for development."""

    async def synthesize(self, text: str, language: str = "en") -> SynthesisResult:
        return SynthesisResult(
            audio_bytes=b"",
            content_type="audio/wav",
            provider="mock",
        )
