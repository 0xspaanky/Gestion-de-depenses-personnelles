// Shared lists + helpers used across the app.

// Category enum values (must match the backend exactly).
export const CATEGORIES = [
  'FOOD',
  'TRANSPORT',
  'SHOPPING',
  'HEALTH',
  'EDUCATION',
  'ENTERTAINMENT',
  'BILLS',
  'TRAVEL',
  'OTHER',
]

// Payment method enum values.
export const PAYMENT_METHODS = ['CASH', 'CARD', 'BANK_TRANSFER', 'OTHER']

// A distinct color for each category (used by badges + the pie chart).
export const CATEGORY_COLORS = {
  FOOD: '#ef4444',
  TRANSPORT: '#3b82f6',
  SHOPPING: '#ec4899',
  HEALTH: '#10b981',
  EDUCATION: '#f59e0b',
  ENTERTAINMENT: '#8b5cf6',
  BILLS: '#0ea5e9',
  TRAVEL: '#14b8a6',
  OTHER: '#6b7280',
}

// A small emoji icon per category for a friendlier UI.
export const CATEGORY_ICONS = {
  FOOD: '🍔',
  TRANSPORT: '🚌',
  SHOPPING: '🛍️',
  HEALTH: '💊',
  EDUCATION: '📚',
  ENTERTAINMENT: '🎬',
  BILLS: '🧾',
  TRAVEL: '✈️',
  OTHER: '📦',
}

// Format a number as a currency-like amount.
export function formatAmount(value) {
  const n = Number(value || 0)
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// Pull a readable message out of an axios error.
export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (error?.response?.data) {
    const data = error.response.data
    if (typeof data === 'string') return data
    if (data.message) return data.message
    if (data.error) return data.error
  }
  if (error?.message) return error.message
  return fallback
}

// Turn an enum value like BANK_TRANSFER into "Bank Transfer".
export function prettyLabel(value) {
  if (!value) return ''
  return value
    .toLowerCase()
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}
