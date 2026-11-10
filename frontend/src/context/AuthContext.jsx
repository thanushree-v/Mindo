import { createContext, useState, useEffect } from 'react'
import * as authApi from '../api/auth'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('minddo_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      authApi
        .getMe()
        .then((data) => {
          setUser(data)
        })
        .catch(() => {
          localStorage.removeItem('minddo_token')
          setToken(null)
          setUser(null)
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  async function login(email, password) {
    const data = await authApi.login({ email, password })
    localStorage.setItem('minddo_token', data.access_token)
    setToken(data.access_token)
    const me = await authApi.getMe()
    setUser(me)
    return me
  }

  async function register(name, email, password) {
    const data = await authApi.register({ name, email, password })
    localStorage.setItem('minddo_token', data.access_token)
    setToken(data.access_token)
    const me = await authApi.getMe()
    setUser(me)
    return me
  }

  function logout() {
    localStorage.removeItem('minddo_token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
