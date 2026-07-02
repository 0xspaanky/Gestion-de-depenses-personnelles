import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getExpense, updateExpense } from '../api/expenses.js'
import { getErrorMessage } from '../constants.js'
import ExpenseForm from '../components/ExpenseForm.jsx'
import Loader from '../components/Loader.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'

export default function EditExpense() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [initialValues, setInitialValues] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')

  // Load the expense and prefill the form.
  useEffect(() => {
    async function load() {
      setLoading(true)
      setLoadError('')
      try {
        const res = await getExpense(id)
        const e = res.data
        setInitialValues({
          title: e.title || '',
          description: e.description || '',
          amount: e.amount ?? '',
          date: e.date || '',
          category: e.category || '',
          paymentMethod: e.paymentMethod || 'CASH',
        })
      } catch (err) {
        setLoadError(getErrorMessage(err, 'Could not load this expense.'))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  async function handleSubmit(values) {
    setSubmitting(true)
    setServerError('')
    try {
      await updateExpense(id, values)
      navigate('/expenses')
    } catch (err) {
      setServerError(getErrorMessage(err, 'Could not update the expense.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Edit Expense</h1>
        <button className="btn btn-ghost" onClick={() => navigate('/expenses')}>
          ← Back
        </button>
      </div>

      {loading ? (
        <Loader label="Loading expense..." />
      ) : loadError ? (
        <ErrorMessage message={loadError} />
      ) : (
        <div className="card form-card">
          <ExpenseForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            submitting={submitting}
            submitLabel="Update Expense"
            serverError={serverError}
          />
        </div>
      )}
    </div>
  )
}
