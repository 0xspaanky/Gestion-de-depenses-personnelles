import { useState } from 'react'
import { CATEGORIES, PAYMENT_METHODS, prettyLabel } from '../constants.js'
import ErrorMessage from './ErrorMessage.jsx'

// Shared form for both "Add" and "Edit" expense pages.
// Props:
//  - initialValues: object to prefill the fields
//  - onSubmit(values): called with the validated form data
//  - submitting: boolean to disable the button while saving
//  - submitLabel: text on the submit button
//  - serverError: error string coming from the API
export default function ExpenseForm({
  initialValues,
  onSubmit,
  submitting = false,
  submitLabel = 'Save',
  serverError = '',
}) {
  const [values, setValues] = useState({
    title: '',
    description: '',
    amount: '',
    date: '',
    category: '',
    paymentMethod: 'CASH',
    ...initialValues,
  })
  const [errors, setErrors] = useState({})

  function handleChange(e) {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  // Client-side validation mirroring the backend rules.
  function validate() {
    const next = {}
    if (!values.title || !values.title.trim()) {
      next.title = 'Title is required.'
    }
    if (values.amount === '' || values.amount === null) {
      next.amount = 'Amount is required.'
    } else if (Number(values.amount) <= 0) {
      next.amount = 'Amount must be greater than 0.'
    }
    if (!values.date) {
      next.date = 'Date is required.'
    }
    if (!values.paymentMethod) {
      next.paymentMethod = 'Payment method is required.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    // Build the ExpenseRequest. Empty category = let the backend auto-detect.
    onSubmit({
      title: values.title.trim(),
      description: values.description ? values.description.trim() : '',
      amount: Number(values.amount),
      date: values.date,
      category: values.category || null,
      paymentMethod: values.paymentMethod,
    })
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <ErrorMessage message={serverError} />

      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          id="title"
          name="title"
          type="text"
          value={values.title}
          onChange={handleChange}
          placeholder="e.g. Lunch at campus"
        />
        {errors.title && <span className="field-error">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          rows="3"
          value={values.description}
          onChange={handleChange}
          placeholder="Optional notes..."
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="amount">Amount *</label>
          <input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            min="0"
            value={values.amount}
            onChange={handleChange}
            placeholder="0.00"
          />
          {errors.amount && <span className="field-error">{errors.amount}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="date">Date *</label>
          <input
            id="date"
            name="date"
            type="date"
            value={values.date}
            onChange={handleChange}
          />
          {errors.date && <span className="field-error">{errors.date}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" name="category" value={values.category} onChange={handleChange}>
            <option value="">Auto-detect</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {prettyLabel(c)}
              </option>
            ))}
          </select>
          <span className="field-hint">Leave on "Auto-detect" to let the app choose.</span>
        </div>

        <div className="form-group">
          <label htmlFor="paymentMethod">Payment Method *</label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={values.paymentMethod}
            onChange={handleChange}
          >
            {PAYMENT_METHODS.map((p) => (
              <option key={p} value={p}>
                {prettyLabel(p)}
              </option>
            ))}
          </select>
          {errors.paymentMethod && <span className="field-error">{errors.paymentMethod}</span>}
        </div>
      </div>

      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  )
}
