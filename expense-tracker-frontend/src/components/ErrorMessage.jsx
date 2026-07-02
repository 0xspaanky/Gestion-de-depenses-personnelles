// A red error box. Pass a message string.
export default function ErrorMessage({ message }) {
  if (!message) return null
  return (
    <div className="error-box">
      <span className="error-icon">⚠️</span>
      <span>{message}</span>
    </div>
  )
}
