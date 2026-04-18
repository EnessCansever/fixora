import { createContext, useState, useEffect, useCallback, useContext } from 'react'
import {
  registerUser,
  loginUser,
  getCurrentUser,
  AUTH_TOKEN_KEY,
  SESSION_EXPIRED_MESSAGE,
  subscribeUnauthorized,
} from '../services/authApi'

const AuthContext = createContext(null)
const AUTH_NOTICE_KEY = 'fixora_auth_notice'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  const clearAuthState = useCallback((noticeMessage = '') => {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    setToken(null)
    setUser(null)

    if (noticeMessage && typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(AUTH_NOTICE_KEY, noticeMessage)
    }
  }, [])

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem(AUTH_TOKEN_KEY)

      if (storedToken) {
        try {
          const userData = await getCurrentUser(storedToken)
          setToken(storedToken)
          setUser(userData.user)
        } catch {
          clearAuthState()
        }
      }

      setIsAuthLoading(false)
    }

    initializeAuth()
  }, [clearAuthState])

  useEffect(() => {
    const unsubscribe = subscribeUnauthorized((message) => {
      clearAuthState(message || SESSION_EXPIRED_MESSAGE)
    })

    return unsubscribe
  }, [clearAuthState])

  const register = useCallback(async (name, email, password) => {
    const data = await registerUser(name, email, password)

    if (!data?.token || !data?.user) {
      throw new Error('Kayıt işlemi sırasında bir hata oluştu.')
    }

    localStorage.setItem(AUTH_TOKEN_KEY, data.token)
    setToken(data.token)
    setUser(data.user)
  }, [])

  const login = useCallback(async (email, password) => {
    const data = await loginUser(email, password)

    if (!data?.token || !data?.user) {
      throw new Error('Giriş işlemi sırasında bir hata oluştu.')
    }

    localStorage.setItem(AUTH_TOKEN_KEY, data.token)
    setToken(data.token)
    setUser(data.user)
  }, [])

  const logout = useCallback(() => {
    clearAuthState()
  }, [clearAuthState])

  const isAuthenticated = !!token && !!user

  const value = {
    user,
    token,
    isAuthenticated,
    isAuthLoading,
    register,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}