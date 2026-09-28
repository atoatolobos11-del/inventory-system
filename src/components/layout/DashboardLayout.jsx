import { useEffect, useState } from 'react'
import Sidebar from './Sidebar.jsx'
import Header from './Header.jsx'

const SIDEBAR_STORAGE_KEY = 'inventory360.sidebar.collapsed'

/**
 * App shell: fixed sidebar (drawer on mobile) + scroll-away header + main region.
 */
export default function DashboardLayout({
  active,
  headingLines,
  showFilters = true,
  period,
  onPeriodChange,
  outlet,
  onOutletChange,
  children,
}) {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_STORAGE_KEY) === '1'
    } catch {
      return false
    }
  })
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, collapsed ? '1' : '0')
    } catch {
      /* localStorage may be unavailable — preference is optional */
    }
  }, [collapsed])

  // Close the mobile drawer whenever the route changes (nav links are <a href>)
  useEffect(() => {
    const closeDrawer = () => setMobileOpen(false)
    window.addEventListener('hashchange', closeDrawer)
    return () => window.removeEventListener('hashchange', closeDrawer)
  }, [])

  return (
    <div className="flex min-h-screen bg-page-bg text-text">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-[2px] lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        active={active}
        onToggleCollapse={() => setCollapsed((v) => !v)}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          onOpenMenu={() => setMobileOpen(true)}
          headingLines={headingLines}
          showFilters={showFilters}
          period={period}
          onPeriodChange={onPeriodChange}
          outlet={outlet}
          onOutletChange={onOutletChange}
        />
        <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 pb-10 pt-6 sm:px-6 lg:px-8 xl:px-10">
          {children}
        </main>
      </div>
    </div>
  )
}