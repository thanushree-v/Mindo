from __future__ import annotations

import uuid

from fastapi import HTTPException, status
from sqlalchemy import case, func, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.notification import Notification


async def create_notification(
    db: AsyncSession,
    user_id: uuid.UUID,
    title: str,
    message: str | None = None,
    reminder_id: uuid.UUID | None = None,
) -> Notification:
    """Create an in-app notification."""
    notification = Notification(
        user_id=user_id,
        title=title,
        message=message,
        reminder_id=reminder_id,
    )
    db.add(notification)
    await db.flush()
    return notification


async def get_notifications(
    db: AsyncSession,
    user_id: uuid.UUID,
    page: int = 1,
    per_page: int = 20,
) -> tuple[list[Notification], int]:
    """List notifications ordered by created_at desc, unread first."""
    base = select(Notification).where(Notification.user_id == user_id)

    # Count total matching
    count_query = select(func.count()).select_from(base.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar_one()

    # Order: unread first, then by created_at desc
    base = base.order_by(
        case((Notification.read == False, 0), else_=1),  # noqa: E712
        Notification.created_at.desc(),
    )
    base = base.offset((page - 1) * per_page).limit(per_page)

    result = await db.execute(base)
    notifications = list(result.scalars().all())

    return notifications, total


async def get_unread_count(
    db: AsyncSession,
    user_id: uuid.UUID,
) -> int:
    """Get count of unread notifications."""
    query = select(func.count()).where(
        Notification.user_id == user_id,
        Notification.read == False,  # noqa: E712
    )
    result = await db.execute(query)
    return result.scalar_one()


async def mark_as_read(
    db: AsyncSession,
    user_id: uuid.UUID,
    notification_id: uuid.UUID,
) -> Notification:
    """Mark a single notification as read."""
    query = select(Notification).where(
        Notification.id == notification_id,
        Notification.user_id == user_id,
    )
    result = await db.execute(query)
    notification = result.scalar_one_or_none()

    if notification is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found",
        )

    notification.read = True
    await db.flush()
    return notification


async def mark_all_as_read(
    db: AsyncSession,
    user_id: uuid.UUID,
) -> None:
    """Mark all notifications as read for a user."""
    stmt = (
        update(Notification)
        .where(
            Notification.user_id == user_id,
            Notification.read == False,  # noqa: E712
        )
        .values(read=True)
    )
    await db.execute(stmt)
    await db.flush()
