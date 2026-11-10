from __future__ import annotations

from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

# Resolve .env from the project root (one level above backend/)
_ENV_FILE = Path(__file__).resolve().parent.parent.parent / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(_ENV_FILE),
        env_file_encoding="utf-8",
    )

    DATABASE_URL: str
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_DAYS: int = 7
    GNANI_API_KEY: str = ""
    GNANI_API_URL: str = ""
    GNANI_TIMBRE_API_KEY: str = ""
    GNANI_TIMBRE_API_URL: str = ""
    LLM_API_KEY: str = ""
    LLM_API_URL: str = ""
    AWS_DEFAULT_REGION: str = ""
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    AWS_SESSION_TOKEN: str = ""
    BEDROCK_MODEL_ID: str = "us.anthropic.claude-sonnet-4-20250514-v1:0"
    CORS_ORIGINS: str = "http://localhost:5173"


settings = Settings()  # type: ignore[call-arg]
