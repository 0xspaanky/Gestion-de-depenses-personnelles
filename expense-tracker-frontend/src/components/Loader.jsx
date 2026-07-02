// Simple loading spinner with an optional label.
export default function Loader({ label = 'Loading...' }) {
  return (
    <div className="loader">
      <div className="spinner" />
      <span>{label}</span>
    </div>
  )
}
