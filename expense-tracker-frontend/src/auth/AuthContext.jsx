import { createContext, useContext, useState } from 'react'
import { loginRequest, registerRequest } from '../api/auth.js'

// A very simple authentication context.
// It keeps the JWT token + user info, and persists them in localStorage
// so the user stays logged in after refreshing the page.
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })

  // Save token + user both in state and in localStorage.
  function saveSession(data) {
    const newUser = { username: data.username, email: data.email }
    setToken(data.token)
    setUser(newUser)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  async function login(credentials) {
    const res = await loginRequest(credentials)
    saveSession(res.data)
    return res.data
  }

  async function register(info) {
    const res = await registerRequest(info)
    saveSession(res.data)
    return res.data
  }

  function logout() {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Small helper hook so components can do: const { user } = useAuth()
export function useAuth() {
  return useContext(AuthContext)
}
