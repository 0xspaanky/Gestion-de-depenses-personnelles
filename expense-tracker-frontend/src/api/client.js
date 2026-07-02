import axios from 'axios'

// Base URL comes from the .env file (VITE_API_URL), with a sensible default.
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:9097/api'

const client = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor: attach the JWT token (if we have one) on every request.
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor: if the token is invalid/expired (401),
// clear local storage and send the user back to the login page.
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Avoid redirect loop if already on the login page.
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default client
