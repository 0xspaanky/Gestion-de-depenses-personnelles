import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createExpense } from '../api/expenses.js'
import { getErrorMessage } from '../constants.js'
import ExpenseForm from '../components/ExpenseForm.jsx'

export default function AddExpense() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')

  // Default the date to today for convenience.
  const today = new Date().toISOString().slice(0, 10)

  async function handleSubmit(values) {
    setSubmitting(true)
    setServerError('')
    try {
      await createExpense(values)
      navigate('/expenses')
    } catch (err) {
      setServerError(getErrorMessage(err, 'Could not save the expense.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Add Expense</h1>
        <button className="btn btn-ghost" onClick={() => navigate('/expenses')}>
          ← Back
        </button>
      </div>

      <div className="card form-card">
        <ExpenseForm
          initialValues={{ date: today }}
          onSubmit={handleSubmit}
          submitting={submitting}
          submitLabel="Save Expense"
          serverError={serverError}
        />
      </div>
    </div>
  )
}
