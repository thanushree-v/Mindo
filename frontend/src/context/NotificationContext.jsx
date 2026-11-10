import { createContext, useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '../hooks/useAuth'
import * as notificationsApi from '../api/notifications'

export const NotificationContext = createContext(null)

const POLL_INTERVAL = 30000

export function NotificationProvider({ children }) {
  const { user } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState([])
  const intervalRef = useRef(null)

  const fetchUnreadCount = useCallback(async () => {
    try {
      const data = await notificationsApi.getUnreadCount()
      setUnreadCount(data.count ?? data.unread_count ?? 0)
    } catch {
      // silently fail polling
    }
  }, [])

  const refreshNotifications = useCallback(async () => {
    try {
      const data = await notificationsApi.getNotifications(1)
      setNotifications(data.items || data)
      await fetchUnreadCount()
    } catch {
      // silently fail
    }
  }, [fetchUnreadCount])

  const markAsRead = useCallback(async (id) => {
    try {
      await notificationsApi.markAsRead(id)
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch {
      // silently fail
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationsApi.markAllAsRead()
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
      )
      setUnreadCount(0)
    } catch {
      // silently fail
    }
  }, [])

  useEffect(() => {
    if (user) {
      fetchUnreadCount()
      intervalRef.current = setInterval(fetchUnreadCount, POLL_INTERVAL)
    } else {
      setUnreadCount(0)
      setNotifications([])
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [user, fetchUnreadCount])

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        notifications,
        refreshNotifications,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
