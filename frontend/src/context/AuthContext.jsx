import { createContext, useContext, useMemo, useState, useEffect } from 'react'
import api from '../lib/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (token) localStorage.setItem('token', token)
    else localStorage.removeItem('token')
  }, [token])

  // Fetch user data when token is available
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          // You'll need to create a /me endpoint in your backend
          const { data } = await api.get('/me')
          setUser(data.data)
        } catch (error) {
          console.error('Failed to fetch user data:', error)
          // If token is invalid, clear it
          if (error.response?.status === 401) {
            setToken(null)
            setUser(null)
          }
        }
      } else {
        setUser(null)
      }
    }
    fetchUser()
  }, [token])

  const signup = async (payload) => {
    const { data } = await api.post('/signup', payload)
    return data
  }

  const login = async (email, password) => {
    const { data } = await api.post('/login', { email, password })
    setToken(data.data)
  }

  const logout = () => {
    setToken(null)
    setUser(null)
  }

  const value = useMemo(() => ({ token, user, setUser, signup, login, logout }), [token, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)


