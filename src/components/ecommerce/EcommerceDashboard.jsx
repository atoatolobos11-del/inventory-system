import {
  ArrowDown,
  ArrowUp,
  Banknote,
  Globe,
  MousePointerClick,
  PackageCheck,
  Receipt,
  ShoppingBag,
  Truck,
} from 'lucide-react'
import OnlineRevenueChart from './OnlineRevenueChart.jsx'
import ChannelBreakdownChart from './ChannelBreakdownChart.jsx'
import ConversionFunnel from './ConversionFunnel.jsx'
import RecentOrders from './RecentOrders.jsx'
import TopSellers from './TopSellers.jsx'
import {
  ecommercePeriods,
  fulfilment,
  formatCurrency,
  formatNumber,
  recentOrders,
  topProducts,
} from '../../data/ecommerceData.js'
import cn from '../../lib/cn.js'

/**
 * Online Store dashboard — the merchant's view of the e-commerce channel.
 *
 * Frontend-only: figures come from the mock `ecommerceData` module and respond
 * to the header period filter. Sits alongside the retail (POS) dashboard and
 * shares the same catalog, so both halves of the shop stay consistent.
 */
export default function EcommerceDashboard({ period = 'This Month' }) {
  const data = ecommercePeriods[period] ?? ecommercePeriods['This Month']
  const { metrics } = data

  const openOrders = recentOrders.filter(
    (order) => order.status === 'unfulfilled' || order.status === 'processing',
  ).length

  return (
    <div className="space-y-5">
      {/* KPI row */}
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        <StatCard
          icon={Banknote}
          label="Online Revenue"
          value={formatCurrency(metrics.revenue)}
          delta={metrics.revenueDelta}
          hint="vs previous period"
        />
        <StatCard
          icon={ShoppingBag}
          label="Orders"
          value={formatNumber(metrics.orders)}
          delta={metrics.ordersDelta}
          hint="vs previous period"
        />
        <StatCard
          icon={MousePointerClick}
          label="Conversion Rate"
          value={`${metrics.conversion.toFixed(2)}%`}
          delta={metrics.conversionDelta}
          deltaSuffix="pt"
          hint={`${formatNumber(metrics.sessions)} sessions`}
        />
        <StatCard
          icon={Receipt}
          label="Average Order Value"
          value={formatCurrency(metrics.averageOrderValue)}
          delta={metrics.averageOrderValueDelta}
          hint="vs previous period"
        />
      </div>

      {/* Action banner — orders awaiting fulfilment */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E8D9A8] bg-[#FBF6E7] px-4 py-3">
        <p className="flex items-start gap-3 text-[13px] leading-relaxed text-[#5A4A1E]">
          <Truck size={16} strokeWidth={2} className="mt-0.5 shrink-0 text-[#7A5B12]" aria-hidden="true" />
          <span>
            <span className="font-semibold">
              {openOrders} {openOrders === 1 ? 'order needs' : 'orders need'} to be shipped
            </span>{' '}
            — {fulfilment.awaitingShipment} are awaiting fulfilment and{' '}
            {fulfilment.inTransit} are in transit.
          </span>
        </p>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-card px-2.5 py-1 text-[11px] font-semibold text-[#5A4A1E] ring-1 ring-[#E8D9A8]">
          <PackageCheck size={12} strokeWidth={2.2} aria-hidden="true" />
          {fulfilment.onTimeRate}% on-time
        </span>
      </div>

      {/* Revenue trend + channel / funnel column */}
      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
        <section className="rounded-2xl border border-line bg-card shadow-card">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line/70 p-5 sm:p-6">
            <div>
              <h2 className="text-[15px] font-bold tracking-tight text-text">Online Revenue</h2>
              <p className="mt-0.5 text-xs text-muted">{period} · all sales channels</p>
            </div>
            <div className="text-right">
              <p className="text-[22px] font-bold leading-none tracking-tight text-text">
                {formatCurrency(metrics.revenue)}
              </p>
              <Delta value={metrics.revenueDelta} className="mt-1.5 justify-end" />
            </div>
          </div>

          <div className="px-3 pb-3 pt-5 sm:px-5">
            <div className="h-[280px]">
              <OnlineRevenueChart data={data.revenueSeries} />
            </div>
          </div>

          <dl className="grid grid-cols-3 divide-x divide-line/70 border-t border-line/70">
            <SummaryStat
              label="Sessions"
              value={formatNumber(metrics.sessions)}
              detail="Unique + repeat"
            />
            <SummaryStat
              label="Returning customers"
              value={`${metrics.returningShare}%`}
              detail="of all sessions"
            />
            <SummaryStat
              label="Avg. handling time"
              value={`${fulfilment.averageHandlingHours}h`}
              detail="Order to dispatch"
            />
          </dl>
        </section>

        <div className="flex flex-col gap-5">
          {/* Channels */}
          <section className="rounded-2xl border border-line bg-card shadow-card">
            <div className="flex items-center gap-2.5 border-b border-line/70 p-5">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-olive-light/70 text-olive">
                <Globe size={15} strokeWidth={2} aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-[15px] font-bold tracking-tight text-text">Sales by Channel</h2>
                <p className="mt-0.5 text-xs text-muted">Where orders come from</p>
              </div>
            </div>
            <div className="px-3 pb-4 pt-4 sm:px-5">
              <div className="h-[188px]">
                <ChannelBreakdownChart data={data.channels} />
              </div>
            </div>
          </section>

          {/* Funnel */}
          <section className="rounded-2xl border border-line bg-card shadow-card">
            <div className="flex items-center gap-2.5 border-b border-line/70 p-5">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-olive-light/70 text-olive">
                <MousePointerClick size={15} strokeWidth={2} aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-[15px] font-bold tracking-tight text-text">Conversion Funnel</h2>
                <p className="mt-0.5 text-xs text-muted">Sessions to purchase</p>
              </div>
            </div>
            <div className="p-5">
              <ConversionFunnel stages={data.funnel} />
            </div>
          </section>
        </div>
      </div>

      {/* Orders + top sellers column */}
      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
        <RecentOrders orders={recentOrders} />

        <div className="flex flex-col gap-5">
          <TopSellers products={topProducts} />
        </div>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------------------
   Small presentational pieces (kept local, matching InventoryPage's pattern)
   --------------------------------------------------------------------------- */

/** Green/red delta with an arrow, e.g. "+24.3%". */
function Delta({ value, suffix = '%', className }) {
  const rising = value >= 0
  return (
    <p
      className={cn(
        'flex items-center gap-0.5 text-[11.5px] font-semibold',
        rising ? 'text-[#4F7A3A]' : 'text-[#9A2B22]',
        className,
      )}
    >
      {rising ? (
        <ArrowUp size={12} strokeWidth={2.4} aria-hidden="true" />
      ) : (
        <ArrowDown size={12} strokeWidth={2.4} aria-hidden="true" />
      )}
      {rising ? '+' : ''}
      {value}
      {suffix}
    </p>
  )
}

function StatCard({ icon: Icon, label, value, delta, deltaSuffix = '%', hint }) {
  return (
    <article className="rounded-2xl border border-line bg-card p-5 shadow-card">
      <div className="flex items-start justify-between gap-2">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-olive-light/70 text-olive">
          <Icon size={17} strokeWidth={2} aria-hidden="true" />
        </span>
        {delta != null && <Delta value={delta} suffix={deltaSuffix} className="mt-1" />}
      </div>
      <p className="mt-3.5 text-[22px] font-bold leading-none tracking-tight text-text">{value}</p>
      <p className="mt-1.5 text-xs font-medium text-muted">{label}</p>
      <p className="mt-3 border-t border-line/70 pt-2.5 text-[11px] leading-snug text-muted">
        {hint}
      </p>
    </article>
  )
}

function SummaryStat({ label, value, detail }) {
  return (
    <div className="px-4 py-3.5 sm:px-5">
      <dt className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted">{label}</dt>
      <dd className="mt-1.5 text-[15px] font-bold leading-none text-text">{value}</dd>
      <dd className="mt-1.5 text-[10.5px] text-muted">{detail}</dd>
    </div>
  )
}
