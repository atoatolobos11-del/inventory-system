import { useEffect, useState } from 'react'
import DashboardLayout from './components/layout/DashboardLayout.jsx'
import AuthPage from './components/auth/AuthPage.jsx'
import OverviewCard from './components/dashboard/OverviewCard.jsx'
import SalesCard from './components/dashboard/SalesCard.jsx'
import TransferCard from './components/dashboard/TransferCard.jsx'
import PurchaseOrdersCard from './components/dashboard/PurchaseOrdersCard.jsx'
import TransferModal from './components/dashboard/TransferModal.jsx'
import OrdersModal from './components/dashboard/OrdersModal.jsx'
import SectionPlaceholder from './components/dashboard/SectionPlaceholder.jsx'
import SellPage from './components/sell/SellPage.jsx'
import InventoryPage from './components/inventory/InventoryPage.jsx'
import EcommerceDashboard from './components/ecommerce/EcommerceDashboard.jsx'
import { periods, NAV_ITEMS } from './data/dashboardData.js'
import { useAuth } from './lib/auth.jsx'
import { useHashRoute } from './lib/useHashRoute.js'

const HOME_HEADING = ["Hi, here's what's happening", 'in your stores']
const AUTH_ROUTES = new Set(['login', 'register'])

export default function App() {
  const route = useHashRoute()
  const { user } = useAuth()

  const [period, setPeriod] = useState('This Month')
  const [outlet, setOutlet] = useState('all')
  const [transferOpen, setTransferOpen] = useState(false)
  const [ordersOpen, setOrdersOpen] = useState(false)

  // Route guard: unauthenticated users land on #/login; signed-in users on
  // an auth page bounce back to the dashboard.
  useEffect(() => {
    if (!user && !AUTH_ROUTES.has(route)) {
      window.location.hash = '#/login'
    } else if (user && AUTH_ROUTES.has(route)) {
      window.location.hash = '#/home'
    }
  }, [user, route])

  if (!user) {
    return <AuthPage intent={route === 'register' ? 'register' : 'login'} />
  }

  const section = NAV_ITEMS.find((item) => item.id === route)
  const isHome = route === 'home' || AUTH_ROUTES.has(route) || !section
  const data = periods[period] ?? periods['This Month']

  return (
    <DashboardLayout
      active={isHome ? 'home' : route}
      headingLines={isHome ? HOME_HEADING : [section.label]}
      showFilters={isHome || route === 'ecommerce'}
      period={period}
      onPeriodChange={setPeriod}
      outlet={outlet}
      onOutletChange={setOutlet}
    >
      {isHome ? (
        <div className="space-y-5">
          <OverviewCard data={data} />

          {/* Lower dashboard grid — ~70% sales card / ~30% right column */}
          <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
            <SalesCard data={data} />
            <div className="flex flex-col gap-5">
              <TransferCard onView={() => setTransferOpen(true)} />
              <PurchaseOrdersCard onView={() => setOrdersOpen(true)} />
            </div>
          </div>
        </div>
      ) : route === 'sell' ? (
        <SellPage />
      ) : route === 'inventory' ? (
        <InventoryPage />
      ) : route === 'ecommerce' ? (
        <EcommerceDashboard period={period} />
      ) : (
        <SectionPlaceholder sectionId={route} />
      )}

      {isHome && (
        <>
          <TransferModal open={transferOpen} onClose={() => setTransferOpen(false)} />
          <OrdersModal open={ordersOpen} onClose={() => setOrdersOpen(false)} />
        </>
      )}
    </DashboardLayout>
  )
}