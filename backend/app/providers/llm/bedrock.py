from __future__ import annotations

import asyncio
import json

import boto3
from fastapi import HTTPException, status

from app.config import settings
from app.providers.llm.base import ExtractionItem, ExtractionResult, LLMProvider

SYSTEM_PROMPT = """\
You are the intent extraction engine of a personal productivity application.

Convert the user's transcript into structured records.

Supported types: task, idea, note, reminder

Rules:
1. Extract every distinct intent.
2. Preserve the user's original meaning.
3. Do not invent deadlines or reminder times.
4. Distinguish task deadlines from reminder times.
5. Resolve relative dates using the supplied current date and timezone.
6. If the date or time is ambiguous, request clarification.
7. Return only valid JSON matching the schema below.
8. Never claim that a task or reminder has been saved.
9. Do not make decisions on behalf of the user.

Return JSON in this exact format:
{
  "items": [
    {
      "type": "task|idea|note|reminder",
      "title": "short title",
      "description": "optional longer description",
      "due_at": "ISO 8601 datetime or null",
      "reminder_at": "ISO 8601 datetime or null",
      "priority": "low|medium|high",
      "category": "personal|work|study|other",
      "needs_clarification": true|false
    }
  ],
  "clarification_questions": ["question if needed"]
}"""


def _extract_json(text: str) -> dict:
    import re

    fence_pattern = re.compile(r"```(?:json)?\s*\n?(.*?)\n?\s*```", re.DOTALL)
    match = fence_pattern.search(text)
    if match:
        return json.loads(match.group(1).strip())

    text = text.strip()
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1 and end > start:
        return json.loads(text[start : end + 1])

    return json.loads(text)


class BedrockLLMProvider(LLMProvider):
    """LLM provider using AWS Bedrock Claude."""

    def __init__(self) -> None:
        kwargs = {"service_name": "bedrock-runtime"}
        if settings.AWS_DEFAULT_REGION:
            kwargs["region_name"] = settings.AWS_DEFAULT_REGION
        if settings.AWS_ACCESS_KEY_ID:
            kwargs["aws_access_key_id"] = settings.AWS_ACCESS_KEY_ID
            kwargs["aws_secret_access_key"] = settings.AWS_SECRET_ACCESS_KEY
        if settings.AWS_SESSION_TOKEN:
            kwargs["aws_session_token"] = settings.AWS_SESSION_TOKEN

        self._client = boto3.client(**kwargs)
        self._model_id = settings.BEDROCK_MODEL_ID

    def _invoke(self, transcript: str, current_time: str, timezone: str) -> str:
        user_message = (
            f"Current time: {current_time}\n"
            f"User timezone: {timezone}\n\n"
            f'Transcript: "{transcript}"'
        )

        body = json.dumps(
            {
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 4096,
                "system": SYSTEM_PROMPT,
                "messages": [{"role": "user", "content": user_message}],
            }
        )

        response = self._client.invoke_model(
            modelId=self._model_id,
            body=body,
            contentType="application/json",
            accept="application/json",
        )

        result = json.loads(response["body"].read())
        return result["content"][0]["text"]

    async def extract(
        self, transcript: str, current_time: str, timezone: str
    ) -> ExtractionResult:
        try:
            content = await asyncio.to_thread(
                self._invoke, transcript, current_time, timezone
            )
            parsed = _extract_json(content)
            return self._parse_result(parsed)

        except self._client.exceptions.AccessDeniedException as exc:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Bedrock access denied: {exc}",
            )
        except self._client.exceptions.ValidationException as exc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Bedrock validation error: {exc}",
            )
        except (json.JSONDecodeError, KeyError, ValueError) as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Failed to parse Bedrock response: {exc}",
            )
        except HTTPException:
            raise
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Bedrock error: {exc}",
            )

    @staticmethod
    def _parse_result(data: dict) -> ExtractionResult:
        items = []
        for item_data in data.get("items", []):
            items.append(
                ExtractionItem(
                    type=item_data.get("type", "task"),
                    title=item_data.get("title", ""),
                    description=item_data.get("description", ""),
                    due_at=item_data.get("due_at"),
                    reminder_at=item_data.get("reminder_at"),
                    priority=item_data.get("priority", "medium"),
                    category=item_data.get("category", "personal"),
                    needs_clarification=item_data.get("needs_clarification", False),
                )
            )
        return ExtractionResult(
            items=items,
            clarification_questions=data.get("clarification_questions", []),
        )
