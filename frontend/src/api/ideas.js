import { apiGet, apiPost, apiPatch, apiDelete } from './client'

export const createIdea = (data) => apiPost('/api/v1/ideas', data)
export const getIdeas = (params = {}) => {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') query.set(k, v)
  })
  return apiGet(`/api/v1/ideas?${query}`)
}
export const getIdea = (id) => apiGet(`/api/v1/ideas/${id}`)
export const updateIdea = (id, data) => apiPatch(`/api/v1/ideas/${id}`, data)
export const deleteIdea = (id) => apiDelete(`/api/v1/ideas/${id}`)
export const convertIdeaToTask = (id) => apiPost(`/api/v1/ideas/${id}/convert-to-task`)
