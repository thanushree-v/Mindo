from __future__ import annotations

import uuid

from fastapi import HTTPException, status
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.idea import Idea
from app.models.task import Task
from app.schemas.idea import IdeaCreate, IdeaUpdate


async def create_idea(
    db: AsyncSession,
    user_id: uuid.UUID,
    data: IdeaCreate,
) -> Idea:
    """Create a new idea."""
    idea = Idea(
        user_id=user_id,
        title=data.title,
        description=data.description,
        capture_id=data.capture_id,
    )
    db.add(idea)
    await db.flush()
    return idea


async def get_ideas(
    db: AsyncSession,
    user_id: uuid.UUID,
    search: str | None = None,
    page: int = 1,
    per_page: int = 20,
) -> tuple[list[Idea], int]:
    """List ideas with search and pagination."""
    base = select(Idea).where(Idea.user_id == user_id)

    if search:
        pattern = f"%{search}%"
        base = base.where(
            or_(
                Idea.title.ilike(pattern),
                Idea.description.ilike(pattern),
            )
        )

    # Count total matching
    count_query = select(func.count()).select_from(base.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar_one()

    # Order and paginate
    base = base.order_by(Idea.created_at.desc())
    base = base.offset((page - 1) * per_page).limit(per_page)

    result = await db.execute(base)
    ideas = list(result.scalars().all())

    return ideas, total


async def get_idea(
    db: AsyncSession,
    user_id: uuid.UUID,
    idea_id: uuid.UUID,
) -> Idea:
    """Get a single idea with ownership check."""
    query = select(Idea).where(
        Idea.id == idea_id,
        Idea.user_id == user_id,
    )
    result = await db.execute(query)
    idea = result.scalar_one_or_none()

    if idea is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Idea not found",
        )
    return idea


async def update_idea(
    db: AsyncSession,
    user_id: uuid.UUID,
    idea_id: uuid.UUID,
    data: IdeaUpdate,
) -> Idea:
    """Update an existing idea."""
    idea = await get_idea(db, user_id, idea_id)

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(idea, field, value)

    await db.flush()
    return idea


async def delete_idea(
    db: AsyncSession,
    user_id: uuid.UUID,
    idea_id: uuid.UUID,
) -> None:
    """Delete an idea."""
    idea = await get_idea(db, user_id, idea_id)
    await db.delete(idea)
    await db.flush()


async def convert_to_task(
    db: AsyncSession,
    user_id: uuid.UUID,
    idea_id: uuid.UUID,
) -> Task:
    """Convert an idea into a task."""
    idea = await get_idea(db, user_id, idea_id)

    task = Task(
        user_id=user_id,
        title=idea.title,
        description=idea.description,
        source="idea",
        capture_id=idea.capture_id,
    )
    db.add(task)
    await db.flush()
    return task
