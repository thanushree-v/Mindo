from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.idea import (
    IdeaCreate,
    IdeaListResponse,
    IdeaResponse,
    IdeaUpdate,
)
from app.schemas.task import TaskResponse
from app.services import idea_service

router = APIRouter(prefix="/api/v1/ideas", tags=["ideas"])


@router.post("", response_model=IdeaResponse, status_code=status.HTTP_201_CREATED)
async def create_idea(
    body: IdeaCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    idea = await idea_service.create_idea(
        db=db,
        user_id=current_user.id,
        data=body,
    )
    return idea


@router.get("", response_model=IdeaListResponse)
async def list_ideas(
    search: str | None = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ideas, total = await idea_service.get_ideas(
        db=db,
        user_id=current_user.id,
        search=search,
        page=page,
        per_page=per_page,
    )
    return IdeaListResponse(
        items=ideas,
        total=total,
        page=page,
        per_page=per_page,
    )


@router.get("/{idea_id}", response_model=IdeaResponse)
async def get_idea(
    idea_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    idea = await idea_service.get_idea(
        db=db,
        user_id=current_user.id,
        idea_id=idea_id,
    )
    return idea


@router.patch("/{idea_id}", response_model=IdeaResponse)
async def update_idea(
    idea_id: uuid.UUID,
    body: IdeaUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    idea = await idea_service.update_idea(
        db=db,
        user_id=current_user.id,
        idea_id=idea_id,
        data=body,
    )
    return idea


@router.delete("/{idea_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_idea(
    idea_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    await idea_service.delete_idea(
        db=db,
        user_id=current_user.id,
        idea_id=idea_id,
    )
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/{idea_id}/convert-to-task", response_model=TaskResponse)
async def convert_idea_to_task(
    idea_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = await idea_service.convert_to_task(
        db=db,
        user_id=current_user.id,
        idea_id=idea_id,
    )
    return task
