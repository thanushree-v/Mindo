from __future__ import annotations

from app.config import settings
from app.providers.llm.base import LLMProvider
from app.providers.speech.base import SpeechProvider
from app.providers.speech.tts_base import TTSProvider


def get_speech_provider() -> SpeechProvider:
    """Return the appropriate speech provider based on configuration."""
    if settings.GNANI_API_KEY:
        from app.providers.speech.gnani import GnaniPrismaProvider

        return GnaniPrismaProvider()

    from app.providers.speech.mock import MockSpeechProvider

    return MockSpeechProvider()


def get_llm_provider() -> LLMProvider:
    """Return the appropriate LLM provider based on LLM_PROVIDER setting."""
    provider = settings.LLM_PROVIDER.lower()

    if provider == "bedrock":
        from app.providers.llm.bedrock import BedrockLLMProvider

        return BedrockLLMProvider()

    if provider == "default":
        from app.providers.llm.default import DefaultLLMProvider

        return DefaultLLMProvider()

    from app.providers.llm.mock import MockLLMProvider

    return MockLLMProvider()


def get_tts_provider() -> TTSProvider:
    """Return the appropriate TTS provider based on configuration."""
    if settings.GNANI_TIMBRE_API_KEY:
        from app.providers.speech.timbre import GnaniTimbreProvider

        return GnaniTimbreProvider()

    from app.providers.speech.mock_tts import MockTTSProvider

    return MockTTSProvider()
