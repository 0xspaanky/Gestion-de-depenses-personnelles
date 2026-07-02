import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getExpenses,
  deleteExpense,
  searchExpenses,
  filterExpenses,
} from '../api/expenses.js'
import { CATEGORIES, prettyLabel, formatAmount, getErrorMessage } from '../constants.js'
import CategoryBadge from '../components/CategoryBadge.jsx'
import Loader from '../components/Loader.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'

export default function ExpenseList() {
  const navigate = useNavigate()

  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Search + filter state
  const [keyword, setKeyword] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    category: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
  })

  // Load all expenses (the default view).
  async function loadAll() {
    setLoading(true)
    setError('')
    try {
      const res = await getExpenses()
      setExpenses(res.data || [])
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load expenses.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAll()
  }, [])

  async function handleSearch(e) {
    e.preventDefault()
    if (!keyword.trim()) {
      loadAll()
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await searchExpenses(keyword.trim())
      setExpenses(res.data || [])
    } catch (err) {
      setError(getErrorMessage(err, 'Search failed.'))
    } finally {
      setLoading(false)
    }
  }

  async function handleApplyFilters(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await filterExpenses(filters)
      setExpenses(res.data || [])
    } catch (err) {
      setError(getErrorMessage(err, 'Filter failed.'))
    } finally {
      setLoading(false)
    }
  }

  function handleResetFilters() {
    setFilters({ category: '', startDate: '', endDate: '', minAmount: '', maxAmount: '' })
    setKeyword('')
    loadAll()
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this expense? This cannot be undone.')) return
    try {
      await deleteExpense(id)
      // Remove it from the local list without a full reload.
      setExpenses((prev) => prev.filter((e) => e.id !== id))
    } catch (err) {
      setError(getErrorMessage(err, 'Could not delete the expense.'))
    }
  }

  function handleFilterChange(e) {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Expenses</h1>
        <button className="btn btn-primary" onClick={() => navigate('/expenses/new')}>
          ➕ Add Expense
        </button>
      </div>

      {/* Search + filter toolbar */}
      <div className="card toolbar">
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search by title or description..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit" className="btn btn-secondary">
            🔍 Search
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setShowFilters((s) => !s)}
          >
            {showFilters ? 'Hide Filters' : 'Filters'}
          </button>
        </form>

        {showFilters && (
          <form className="filter-panel" onSubmit={handleApplyFilters}>
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={filters.category} onChange={handleFilterChange}>
                <option value="">All</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {prettyLabel(c)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>From</label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
              />
            </div>

            <div className="form-group">
              <label>To</label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
              />
            </div>

            <div className="form-group">
              <label>Min Amount</label>
              <input
                type="number"
                step="0.01"
                name="minAmount"
                value={filters.minAmount}
                onChange={handleFilterChange}
                placeholder="0"
              />
            </div>

            <div className="form-group">
              <label>Max Amount</label>
              <input
                type="number"
                step="0.01"
                name="maxAmount"
                value={filters.maxAmount}
                onChange={handleFilterChange}
                placeholder="9999"
              />
            </div>

            <div className="filter-actions">
              <button type="submit" className="btn btn-primary">
                Apply
              </button>
              <button type="button" className="btn btn-ghost" onClick={handleResetFilters}>
                Reset
              </button>
            </div>
          </form>
        )}
      </div>

      <ErrorMessage message={error} />

      {/* Table / states */}
      {loading ? (
        <Loader label="Loading expenses..." />
      ) : expenses.length === 0 ? (
        <div className="card empty-state">
          <span className="empty-icon">🗒️</span>
          <p>No expenses found.</p>
          <button className="btn btn-primary" onClick={() => navigate('/expenses/new')}>
            Add your first expense
          </button>
        </div>
      ) : (
        <div className="card table-card">
          <div className="table-scroll">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Payment</th>
                  <th className="th-right">Amount</th>
                  <th className="th-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp.id}>
                    <td>
                      <div className="cell-title">{exp.title}</div>
                      {exp.description && (
                        <div className="cell-desc">{exp.description}</div>
                      )}
                    </td>
                    <td>
                      <CategoryBadge category={exp.category} />
                    </td>
                    <td>{exp.date}</td>
                    <td>{prettyLabel(exp.paymentMethod)}</td>
                    <td className="th-right">
                      <span className="amount">{formatAmount(exp.amount)}</span>
                    </td>
                    <td className="th-right">
                      <div className="row-actions">
                        <button
                          className="btn-icon edit"
                          title="Edit"
                          onClick={() => navigate(`/expenses/${exp.id}/edit`)}
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-icon delete"
                          title="Delete"
                          onClick={() => handleDelete(exp.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
