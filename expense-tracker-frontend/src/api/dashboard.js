import client from './client.js'

// GET /api/dashboard/summary -> { totalExpenses, count, average, highest }
export function getSummary() {
  return client.get('/dashboard/summary')
}

// GET /api/dashboard/monthly -> [{ month: "2026-06", total }]
export function getMonthly() {
  return client.get('/dashboard/monthly')
}

// GET /api/dashboard/categories -> [{ category, total, count }]
export function getCategories() {
  return client.get('/dashboard/categories')
}

// GET /api/dashboard/recent -> [ExpenseResponse]
export function getRecent() {
  return client.get('/dashboard/recent')
}
