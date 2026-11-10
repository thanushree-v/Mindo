from __future__ import annotations

import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, Query, Response, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.task import (
    TaskCreate,
    TaskListResponse,
    TaskResponse,
    TaskUpdate,
)
from app.services import task_service

router = APIRouter(prefix="/api/v1/tasks", tags=["tasks"])


class PostponeRequest(BaseModel):
    new_due_at: datetime | None = None


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    body: TaskCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = await task_service.create_task(
        db=db,
        user_id=current_user.id,
        data=body,
    )
    return task


@router.get("", response_model=TaskListResponse)
async def list_tasks(
    task_status: str | None = Query(None, alias="status"),
    category: str | None = None,
    search: str | None = None,
    sort_by: str = Query("created_at", pattern="^(created_at|due_at|priority|updated_at)$"),
    order: str = Query("desc", pattern="^(asc|desc)$"),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    tasks, total = await task_service.get_tasks(
        db=db,
        user_id=current_user.id,
        task_status=task_status,
        category=category,
        search=search,
        sort_by=sort_by,
        order=order,
        page=page,
        per_page=per_page,
    )
    return TaskListResponse(
        items=tasks,
        total=total,
        page=page,
        per_page=per_page,
    )


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = await task_service.get_task(
        db=db,
        user_id=current_user.id,
        task_id=task_id,
    )
    return task


@router.patch("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: uuid.UUID,
    body: TaskUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = await task_service.update_task(
        db=db,
        user_id=current_user.id,
        task_id=task_id,
        data=body,
    )
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    await task_service.delete_task(
        db=db,
        user_id=current_user.id,
        task_id=task_id,
    )
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/{task_id}/complete", response_model=TaskResponse)
async def complete_task(
    task_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = await task_service.complete_task(
        db=db,
        user_id=current_user.id,
        task_id=task_id,
    )
    return task


@router.post("/{task_id}/postpone", response_model=TaskResponse)
async def postpone_task(
    task_id: uuid.UUID,
    body: PostponeRequest | None = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    new_due_at = body.new_due_at if body else None
    task = await task_service.postpone_task(
        db=db,
        user_id=current_user.id,
        task_id=task_id,
        new_due_at=new_due_at,
    )
    return task
