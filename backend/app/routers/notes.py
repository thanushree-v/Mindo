from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.note import (
    NoteCreate,
    NoteListResponse,
    NoteResponse,
    NoteUpdate,
)
from app.services import note_service

router = APIRouter(prefix="/api/v1/notes", tags=["notes"])


@router.post("/", response_model=NoteResponse, status_code=status.HTTP_201_CREATED)
async def create_note(
    body: NoteCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    note = await note_service.create_note(
        db=db,
        user_id=current_user.id,
        data=body,
    )
    return note


@router.get("/", response_model=NoteListResponse)
async def list_notes(
    search: str | None = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    notes, total = await note_service.get_notes(
        db=db,
        user_id=current_user.id,
        search=search,
        page=page,
        per_page=per_page,
    )
    return NoteListResponse(
        items=notes,
        total=total,
        page=page,
        per_page=per_page,
    )


@router.get("/{note_id}", response_model=NoteResponse)
async def get_note(
    note_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    note = await note_service.get_note(
        db=db,
        user_id=current_user.id,
        note_id=note_id,
    )
    return note


@router.patch("/{note_id}", response_model=NoteResponse)
async def update_note(
    note_id: uuid.UUID,
    body: NoteUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    note = await note_service.update_note(
        db=db,
        user_id=current_user.id,
        note_id=note_id,
        data=body,
    )
    return note


@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_note(
    note_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    await note_service.delete_note(
        db=db,
        user_id=current_user.id,
        note_id=note_id,
    )
    return Response(status_code=status.HTTP_204_NO_CONTENT)
