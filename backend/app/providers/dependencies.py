from __future__ import annotations

from app.config import settings
from app.providers.llm.base import LLMProvider
from app.providers.speech.base import SpeechProvider


def get_speech_provider() -> SpeechProvider:
    """Return the appropriate speech provider based on configuration."""
    if settings.GNANI_API_KEY:
        from app.providers.speech.gnani import GnaniPrismaProvider

        return GnaniPrismaProvider()

    from app.providers.speech.mock import MockSpeechProvider

    return MockSpeechProvider()


def get_llm_provider() -> LLMProvider:
    """Return the appropriate LLM provider based on configuration."""
    if settings.LLM_API_KEY:
        from app.providers.llm.default import DefaultLLMProvider

        return DefaultLLMProvider()

    from app.providers.llm.mock import MockLLMProvider

    return MockLLMProvider()
