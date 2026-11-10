import { apiGet, apiPost, apiPatch, apiDelete } from './client'

export const createTask = (data) => apiPost('/api/v1/tasks', data)
export const getTasks = (params = {}) => {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') query.set(k, v)
  })
  return apiGet(`/api/v1/tasks?${query}`)
}
export const getTask = (id) => apiGet(`/api/v1/tasks/${id}`)
export const updateTask = (id, data) => apiPatch(`/api/v1/tasks/${id}`, data)
export const deleteTask = (id) => apiDelete(`/api/v1/tasks/${id}`)
export const completeTask = (id) => apiPost(`/api/v1/tasks/${id}/complete`)
export const postponeTask = (id, newDueAt) => apiPost(`/api/v1/tasks/${id}/postpone`, { new_due_at: newDueAt })
