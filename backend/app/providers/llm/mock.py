from __future__ import annotations

from datetime import datetime, timedelta, timezone

from app.providers.llm.base import ExtractionItem, ExtractionResult, LLMProvider


class MockLLMProvider(LLMProvider):
    """Mock LLM provider for development and testing."""

    async def extract(
        self, transcript: str, current_time: str, tz: str
    ) -> ExtractionResult:
        now = datetime.now(timezone.utc)
        tomorrow = now + timedelta(days=1)
        next_friday = now + timedelta(days=(4 - now.weekday()) % 7 or 7)

        items: list[ExtractionItem] = []
        clarification_questions: list[str] = []
        lower = transcript.lower()

        if "remind" in lower:
            items.append(
                ExtractionItem(
                    type="reminder",
                    title="Call Mom",
                    description="Reminder to call Mom",
                    reminder_at=tomorrow.replace(hour=19, minute=0, second=0).isoformat(),
                    priority="medium",
                    category="personal",
                )
            )

        if "idea" in lower or "save this idea" in lower:
            items.append(
                ExtractionItem(
                    type="idea",
                    title="New idea from voice note",
                    description=transcript,
                    priority="low",
                    category="personal",
                )
            )

        if "assignment" in lower or "submit" in lower:
            items.append(
                ExtractionItem(
                    type="task",
                    title="Submit assignment",
                    description="Submit the assignment before the deadline",
                    due_at=next_friday.replace(hour=23, minute=59, second=0).isoformat(),
                    priority="high",
                    category="study",
                )
            )

        # Default: if no specific keywords matched, return a generic task
        if not items:
            items.append(
                ExtractionItem(
                    type="task",
                    title=transcript[:80] if len(transcript) > 80 else transcript,
                    description=transcript,
                    due_at=tomorrow.isoformat(),
                    priority="medium",
                    category="personal",
                )
            )

        return ExtractionResult(
            items=items,
            clarification_questions=clarification_questions,
        )
