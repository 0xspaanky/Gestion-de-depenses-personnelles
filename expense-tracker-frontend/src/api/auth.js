import client from './client.js'

// POST /api/auth/register -> { token, username, email }
export function registerRequest({ username, email, password }) {
  return client.post('/auth/register', { username, email, password })
}

// POST /api/auth/login -> { token, username, email }
export function loginRequest({ username, password }) {
  return client.post('/auth/login', { username, password })
}
