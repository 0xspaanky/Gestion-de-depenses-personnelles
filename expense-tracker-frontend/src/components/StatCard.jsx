// A dashboard metric card: icon + label + value.
export default function StatCard({ icon, label, value, accent = '#6366f1' }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ backgroundColor: `${accent}1a`, color: accent }}>
        {icon}
      </div>
      <div className="stat-body">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
      </div>
    </div>
  )
}
