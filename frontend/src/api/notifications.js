import { apiGet, apiPost } from './client'

export const getNotifications = (page = 1) => apiGet(`/api/v1/notifications?page=${page}`)
export const getUnreadCount = () => apiGet('/api/v1/notifications/unread-count')
export const markAsRead = (id) => apiPost(`/api/v1/notifications/${id}/read`)
export const markAllAsRead = () => apiPost('/api/v1/notifications/read-all')
