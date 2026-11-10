from __future__ import annotations

import uuid
from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate


async def create_task(
    db: AsyncSession,
    user_id: uuid.UUID,
    data: TaskCreate,
) -> Task:
    """Create a new task."""
    task = Task(
        user_id=user_id,
        title=data.title,
        description=data.description,
        due_at=data.due_at,
        priority=data.priority,
        status=data.status,
        category=data.category,
        source=data.source,
        capture_id=data.capture_id,
    )
    db.add(task)
    await db.flush()
    return task


async def get_tasks(
    db: AsyncSession,
    user_id: uuid.UUID,
    task_status: str | None = None,
    category: str | None = None,
    search: str | None = None,
    sort_by: str = "created_at",
    order: str = "desc",
    page: int = 1,
    per_page: int = 20,
) -> tuple[list[Task], int]:
    """List tasks with filtering, search, sorting, and pagination."""
    base = select(Task).where(Task.user_id == user_id)

    # Filters
    if task_status:
        base = base.where(Task.status == task_status)
    if category:
        base = base.where(Task.category == category)
    if search:
        pattern = f"%{search}%"
        base = base.where(
            or_(
                Task.title.ilike(pattern),
                Task.description.ilike(pattern),
            )
        )

    # Count total matching
    count_query = select(func.count()).select_from(base.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar_one()

    # Sorting
    allowed_sort_fields = {
        "created_at": Task.created_at,
        "due_at": Task.due_at,
        "priority": Task.priority,
        "updated_at": Task.updated_at,
    }
    sort_column = allowed_sort_fields.get(sort_by, Task.created_at)
    if order == "asc":
        base = base.order_by(sort_column.asc())
    else:
        base = base.order_by(sort_column.desc())

    # Pagination
    base = base.offset((page - 1) * per_page).limit(per_page)

    result = await db.execute(base)
    tasks = list(result.scalars().all())

    return tasks, total


async def get_task(
    db: AsyncSession,
    user_id: uuid.UUID,
    task_id: uuid.UUID,
) -> Task:
    """Get a single task with ownership check."""
    query = select(Task).where(
        Task.id == task_id,
        Task.user_id == user_id,
    )
    result = await db.execute(query)
    task = result.scalar_one_or_none()

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
    return task


async def update_task(
    db: AsyncSession,
    user_id: uuid.UUID,
    task_id: uuid.UUID,
    data: TaskUpdate,
) -> Task:
    """Update an existing task."""
    task = await get_task(db, user_id, task_id)

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(task, field, value)

    await db.flush()
    return task


async def delete_task(
    db: AsyncSession,
    user_id: uuid.UUID,
    task_id: uuid.UUID,
) -> None:
    """Delete a task."""
    task = await get_task(db, user_id, task_id)
    await db.delete(task)
    await db.flush()


async def complete_task(
    db: AsyncSession,
    user_id: uuid.UUID,
    task_id: uuid.UUID,
) -> Task:
    """Mark a task as completed."""
    task = await get_task(db, user_id, task_id)
    task.status = "completed"
    await db.flush()
    return task


async def postpone_task(
    db: AsyncSession,
    user_id: uuid.UUID,
    task_id: uuid.UUID,
    new_due_at: datetime | None = None,
) -> Task:
    """Postpone a task, optionally setting a new due date."""
    task = await get_task(db, user_id, task_id)
    task.status = "postponed"
    if new_due_at is not None:
        task.due_at = new_due_at
    await db.flush()
    return task
