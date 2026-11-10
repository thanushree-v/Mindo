from __future__ import annotations

from app.providers.speech.base import SpeechProvider, TranscriptionResult


class MockSpeechProvider(SpeechProvider):
    """Mock speech provider for development and testing."""

    CANNED_TRANSCRIPT = (
        "I need to submit my assignment by Friday and remind me to call Mom at 7 PM"
    )

    async def transcribe(
        self, audio_bytes: bytes, language: str = "en"
    ) -> TranscriptionResult:
        return TranscriptionResult(
            transcript=self.CANNED_TRANSCRIPT,
            language=language,
            confidence=0.95,
            provider="mock",
        )
