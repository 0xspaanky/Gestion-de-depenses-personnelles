import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'

// Layout used by all protected pages: sidebar on the left, page content on the right.
// <Outlet /> renders whichever child route is active.
export default function Layout() {
  return (
    <div className="layout">
      <Sidebar />
      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}
