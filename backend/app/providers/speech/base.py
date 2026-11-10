from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class TranscriptionResult:
    transcript: str
    language: str
    confidence: float | None = None
    provider: str = ""


class SpeechProvider(ABC):
    @abstractmethod
    async def transcribe(
        self, audio_bytes: bytes, language: str = "en"
    ) -> TranscriptionResult: ...
