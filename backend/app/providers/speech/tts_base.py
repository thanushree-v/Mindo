from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class SynthesisResult:
    audio_bytes: bytes
    content_type: str
    provider: str


class TTSProvider(ABC):
    @abstractmethod
    async def synthesize(self, text: str, language: str = "en") -> SynthesisResult:
        ...
