from __future__ import annotations

import uuid

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.note import Note
from app.schemas.note import NoteCreate, NoteUpdate


async def create_note(
    db: AsyncSession,
    user_id: uuid.UUID,
    data: NoteCreate,
) -> Note:
    """Create a new note."""
    note = Note(
        user_id=user_id,
        content=data.content,
        capture_id=data.capture_id,
    )
    db.add(note)
    await db.flush()
    return note


async def get_notes(
    db: AsyncSession,
    user_id: uuid.UUID,
    search: str | None = None,
    page: int = 1,
    per_page: int = 20,
) -> tuple[list[Note], int]:
    """List notes with search and pagination."""
    base = select(Note).where(Note.user_id == user_id)

    if search:
        pattern = f"%{search}%"
        base = base.where(Note.content.ilike(pattern))

    # Count total matching
    count_query = select(func.count()).select_from(base.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar_one()

    # Order and paginate
    base = base.order_by(Note.created_at.desc())
    base = base.offset((page - 1) * per_page).limit(per_page)

    result = await db.execute(base)
    notes = list(result.scalars().all())

    return notes, total


async def get_note(
    db: AsyncSession,
    user_id: uuid.UUID,
    note_id: uuid.UUID,
) -> Note:
    """Get a single note with ownership check."""
    query = select(Note).where(
        Note.id == note_id,
        Note.user_id == user_id,
    )
    result = await db.execute(query)
    note = result.scalar_one_or_none()

    if note is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found",
        )
    return note


async def update_note(
    db: AsyncSession,
    user_id: uuid.UUID,
    note_id: uuid.UUID,
    data: NoteUpdate,
) -> Note:
    """Update an existing note."""
    note = await get_note(db, user_id, note_id)

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(note, field, value)

    await db.flush()
    return note


async def delete_note(
    db: AsyncSession,
    user_id: uuid.UUID,
    note_id: uuid.UUID,
) -> None:
    """Delete a note."""
    note = await get_note(db, user_id, note_id)
    await db.delete(note)
    await db.flush()
