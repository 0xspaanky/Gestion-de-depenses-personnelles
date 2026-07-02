import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'

// Wraps protected pages. If there is no token, redirect to /login.
export default function ProtectedRoute({ children }) {
  const { token } = useAuth()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}
