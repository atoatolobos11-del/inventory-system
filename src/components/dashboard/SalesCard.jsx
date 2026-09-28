import { useState } from 'react'
import MonthlySalesChart from '../charts/MonthlySalesChart.jsx'
import Metric from './Metric.jsx'
import { formatCurrency, formatNumber } from '../../data/dashboardData.js'

/**
 * "Your Sales this Month" — large chart + three-column metrics row.
 * "+ SHOW MORE RETAIL METRICS" reveals extra mock metrics.
 */
export default function SalesCard({ data }) {
  const [showMore, setShowMore] = useState(false)
  const { salesTitle, sales, targets, retailMetrics } = data

  return (
    <section className="rounded-2xl border border-line bg-card p-5 shadow-card sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[15px] font-bold tracking-tight text-text">{salesTitle}</h2>
        <button
          type="button"
          onClick={() => setShowMore((v) => !v)}
          aria-expanded={showMore}
          className="rounded-md px-2 py-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted transition-colors hover:text-olive"
        >
          {showMore ? 'Hide Retail Metrics' : '+ Show More Retail Metrics'}
        </button>
      </div>

      <div className="mt-4 h-[340px] sm:h-[380px]">
        <MonthlySalesChart data={sales} />
      </div>

      {/* Metrics row */}
      <div className="mt-5 grid grid-cols-1 divide-y divide-line/70 rounded-xl border border-line bg-soft/50 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <div className="px-4 py-4">
          <Metric label={targets.targetLabel} value={formatCurrency(targets.targetValue)} />
          <button
            type="button"
            className="mt-2.5 text-[11px] font-medium text-muted underline decoration-line decoration-auto underline-offset-2 transition-colors hover:text-olive"
          >
            {targets.targetAction}
          </button>
        </div>
        <div className="px-4 py-4">
          <Metric
            label={targets.averageLabel}
            value={formatCurrency(targets.averageValue)}
            detail={targets.averageSupport}
          />
        </div>
        <div className="px-4 py-4">
          <Metric
            label={targets.itemsLabel}
            value={formatNumber(targets.itemsValue, 0)}
            detail={targets.itemsSupport}
          />
        </div>
      </div>

      {/* Extra retail metrics (toggle) */}
      {showMore && (
        <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-5 rounded-xl border border-line bg-soft/60 p-4 sm:grid-cols-4">
          <Metric label="Units Sold" value={formatNumber(retailMetrics.unitsSold)} />
          <Metric label="Refunds" value={formatCurrency(retailMetrics.refunds)} />
          <Metric label="Gross Revenue" value={formatCurrency(retailMetrics.grossRevenue)} />
          <Metric label="Net Revenue" value={formatCurrency(retailMetrics.netRevenue)} />
        </div>
      )}
    </section>
  )
}