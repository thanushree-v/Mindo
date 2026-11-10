import { apiGet, apiPost, apiPatch, apiDelete } from './client'

export const createNote = (data) => apiPost('/api/v1/notes', data)
export const getNotes = (params = {}) => {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') query.set(k, v)
  })
  return apiGet(`/api/v1/notes?${query}`)
}
export const getNote = (id) => apiGet(`/api/v1/notes/${id}`)
export const updateNote = (id, data) => apiPatch(`/api/v1/notes/${id}`, data)
export const deleteNote = (id) => apiDelete(`/api/v1/notes/${id}`)
