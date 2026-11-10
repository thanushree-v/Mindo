from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass, field


@dataclass
class ExtractionItem:
    type: str  # task, idea, note, reminder
    title: str
    description: str = ""
    due_at: str | None = None
    reminder_at: str | None = None
    priority: str = "medium"
    category: str = "personal"
    needs_clarification: bool = False


@dataclass
class ExtractionResult:
    items: list[ExtractionItem] = field(default_factory=list)
    clarification_questions: list[str] = field(default_factory=list)


class LLMProvider(ABC):
    @abstractmethod
    async def extract(
        self, transcript: str, current_time: str, timezone: str
    ) -> ExtractionResult: ...
