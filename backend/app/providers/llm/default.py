from __future__ import annotations

import json
import re

import httpx
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
    """Extract JSON from text that may be wrapped in markdown code fences."""
    # Try to find JSON in markdown code fences
    fence_pattern = re.compile(r"```(?:json)?\s*\n?(.*?)\n?\s*```", re.DOTALL)
    match = fence_pattern.search(text)
    if match:
        return json.loads(match.group(1).strip())

    # Try to parse the whole text as JSON
    text = text.strip()
    # Find the first { and last } to extract JSON object
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1 and end > start:
        return json.loads(text[start : end + 1])

    return json.loads(text)


class DefaultLLMProvider(LLMProvider):
    """LLM provider that calls a remote API for intent extraction."""

    def __init__(
        self,
        api_url: str | None = None,
        api_key: str | None = None,
        timeout: float = 30.0,
    ) -> None:
        self.api_url = api_url or settings.LLM_API_URL
        self.api_key = api_key or settings.LLM_API_KEY
        self.timeout = timeout

    async def extract(
        self, transcript: str, current_time: str, timezone: str
    ) -> ExtractionResult:
        if not self.api_url or not self.api_key:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="LLM provider is not configured",
            )

        user_message = (
            f"Current time: {current_time}\n"
            f"User timezone: {timezone}\n\n"
            f'Transcript: "{transcript}"'
        )

        payload = {
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message},
            ],
        }

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
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
                    detail=f"LLM provider returned status {response.status_code}: {response.text[:200]}",
                )

            result = response.json()

            # Extract the assistant's message content (handle various API formats)
            content = ""
            if "choices" in result and result["choices"]:
                # OpenAI-compatible format
                content = result["choices"][0].get("message", {}).get("content", "")
            elif "content" in result:
                # Simple format
                content = result["content"]
            elif "response" in result:
                content = result["response"]
            else:
                content = response.text

            parsed = _extract_json(content)
            return self._parse_result(parsed)

        except httpx.TimeoutException:
            raise HTTPException(
                status_code=status.HTTP_504_GATEWAY_TIMEOUT,
                detail="LLM provider request timed out",
            )
        except httpx.RequestError as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"LLM provider connection error: {exc}",
            )
        except HTTPException:
            raise
        except (json.JSONDecodeError, KeyError, ValueError) as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Failed to parse LLM response: {exc}",
            )
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected error during extraction: {exc}",
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
