import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts'
import { getSummary, getMonthly, getCategories, getRecent } from '../api/dashboard.js'
import { CATEGORY_COLORS, formatAmount, prettyLabel, getErrorMessage } from '../constants.js'
import StatCard from '../components/StatCard.jsx'
import CategoryBadge from '../components/CategoryBadge.jsx'
import Loader from '../components/Loader.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [monthly, setMonthly] = useState([])
  const [categories, setCategories] = useState([])
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError('')
      try {
        // Load all dashboard data in parallel.
        const [sRes, mRes, cRes, rRes] = await Promise.all([
          getSummary(),
          getMonthly(),
          getCategories(),
          getRecent(),
        ])
        setSummary(sRes.data)
        setMonthly(mRes.data || [])
        setCategories(cRes.data || [])
        setRecent(rRes.data || [])
      } catch (err) {
        setError(getErrorMessage(err, 'Could not load the dashboard.'))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <Loader label="Loading dashboard..." />

  // Prepare data for the pie chart (use a friendly label).
  const pieData = categories.map((c) => ({
    name: prettyLabel(c.category),
    rawCategory: c.category,
    value: Number(c.total),
  }))

  return (
    <div className="page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <Link to="/expenses/new" className="btn btn-primary">
          ➕ Add Expense
        </Link>
      </div>

      <ErrorMessage message={error} />

      {/* Stat cards */}
      <div className="stat-grid">
        <StatCard
          icon="💰"
          label="Total Expenses"
          value={formatAmount(summary?.totalExpenses)}
          accent="#6366f1"
        />
        <StatCard
          icon="🧾"
          label="Number of Expenses"
          value={summary?.count ?? 0}
          accent="#7c3aed"
        />
        <StatCard
          icon="📈"
          label="Average"
          value={formatAmount(summary?.average)}
          accent="#0ea5e9"
        />
        <StatCard
          icon="🔝"
          label="Highest"
          value={formatAmount(summary?.highest)}
          accent="#ef4444"
        />
      </div>

      {/* Charts */}
      <div className="chart-grid">
        <div className="card">
          <h2 className="card-title">Monthly Spending</h2>
          {monthly.length === 0 ? (
            <p className="empty-hint">No monthly data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthly} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef0f5" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => formatAmount(v)} />
                <Bar dataKey="total" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card">
          <h2 className="card-title">Expenses by Category</h2>
          {pieData.length === 0 ? (
            <p className="empty-hint">No category data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={(entry) => entry.name}
                >
                  {pieData.map((entry) => (
                    <Cell
                      key={entry.rawCategory}
                      fill={CATEGORY_COLORS[entry.rawCategory] || '#6b7280'}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatAmount(v)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent expenses */}
      <div className="card">
        <h2 className="card-title">Recent Expenses</h2>
        {recent.length === 0 ? (
          <p className="empty-hint">No recent expenses.</p>
        ) : (
          <ul className="recent-list">
            {recent.map((exp) => (
              <li key={exp.id} className="recent-item">
                <div className="recent-left">
                  <CategoryBadge category={exp.category} />
                  <div>
                    <div className="recent-title">{exp.title}</div>
                    <div className="recent-date">{exp.date}</div>
                  </div>
                </div>
                <div className="amount">{formatAmount(exp.amount)}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
