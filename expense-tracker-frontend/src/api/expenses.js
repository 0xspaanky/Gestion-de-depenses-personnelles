import client from './client.js'

// GET all expenses for the logged-in user
export function getExpenses() {
  return client.get('/expenses')
}

// GET a single expense by id
export function getExpense(id) {
  return client.get(`/expenses/${id}`)
}

// POST create a new expense
export function createExpense(data) {
  return client.post('/expenses', data)
}

// PUT update an existing expense
export function updateExpense(id, data) {
  return client.put(`/expenses/${id}`, data)
}

// DELETE an expense
export function deleteExpense(id) {
  return client.delete(`/expenses/${id}`)
}

// GET search by keyword
export function searchExpenses(keyword) {
  return client.get('/expenses/search', { params: { keyword } })
}

// GET filter by category / date range / amount range (all optional)
export function filterExpenses(filters) {
  // Only send params that actually have a value.
  const params = {}
  if (filters.category) params.category = filters.category
  if (filters.startDate) params.startDate = filters.startDate
  if (filters.endDate) params.endDate = filters.endDate
  if (filters.minAmount !== '' && filters.minAmount != null) params.minAmount = filters.minAmount
  if (filters.maxAmount !== '' && filters.maxAmount != null) params.maxAmount = filters.maxAmount
  return client.get('/expenses/filter', { params })
}
