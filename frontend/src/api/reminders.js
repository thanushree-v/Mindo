import { apiGet, apiPost, apiPatch, apiDelete } from './client'

export const createReminder = (data) => apiPost('/api/v1/reminders', data)
export const getReminders = (params = {}) => {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') query.set(k, v)
  })
  return apiGet(`/api/v1/reminders?${query}`)
}
export const getReminder = (id) => apiGet(`/api/v1/reminders/${id}`)
export const updateReminder = (id, data) => apiPatch(`/api/v1/reminders/${id}`, data)
export const cancelReminder = (id) => apiDelete(`/api/v1/reminders/${id}`)
