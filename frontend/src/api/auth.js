import { apiPost, apiGet } from './client'

export const register = (data) => apiPost('/api/v1/auth/register', data)
export const login = (data) => apiPost('/api/v1/auth/login', data)
export const getMe = () => apiGet('/api/v1/auth/me')
