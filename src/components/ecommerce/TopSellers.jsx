import { ArrowDown, ArrowUp, TrendingUp } from 'lucide-react'
import ProductIcon from '../products/ProductIcon.jsx'
import { formatCurrencyShort, formatNumber } from '../../data/ecommerceData.js'
import { stockStatus } from '../../data/dashboardData.js'
import cn from '../../lib/cn.js'

/**
 * Best-selling products online, ranked by revenue.
 * Shares the catalog with Inventory/Sell, so a seller running out of stock
 * on a top performer is visible without leaving the page.
 */
export default function TopSellers({ products, limit = 6 }) {
  const rows = products.slice(0, limit)
  const peak = rows[0]?.revenue ?? 1

  return (
    <section className="rounded-2xl border border-line bg-card shadow-card">
      <div className="flex items-center justify-between gap-3 border-b border-line/70 p-5 sm:p-6">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-olive-light/70 text-olive">
            <TrendingUp size={15} strokeWidth={2} aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-[15px] font-bold tracking-tight text-text">Top Sellers</h2>
            <p className="mt-0.5 text-xs text-muted">Online revenue, highest first</p>
          </div>
        </div>
      </div>

      <ol className="divide-y divide-line/70">
        {rows.map((product, index) => {
          const rising = product.trend >= 0
          const soldOut = stockStatus(product) === 'out'

          return (
            <li key={product.id} className="px-5 py-3.5 transition-colors hover:bg-soft/50 sm:px-6">
              <div className="flex items-center gap-3">
                <span className="w-4 shrink-0 text-[11px] font-bold text-muted/70">
                  {index + 1}
                </span>

                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-soft text-muted ring-1 ring-line">
                  <ProductIcon name={product.icon} size={19} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-text">{product.name}</p>
                  <p className="text-[11px] text-muted">
                    {product.sku} · {formatNumber(product.units)} units
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-[13px] font-bold text-text">
                    {formatCurrencyShort(product.revenue)}
                  </p>
                  <p
                    className={cn(
                      'flex items-center justify-end gap-0.5 text-[11px] font-semibold',
                      rising ? 'text-[#4F7A3A]' : 'text-[#9A2B22]',
                    )}
                  >
                    {rising ? (
                      <ArrowUp size={11} strokeWidth={2.4} aria-hidden="true" />
                    ) : (
                      <ArrowDown size={11} strokeWidth={2.4} aria-hidden="true" />
                    )}
                    {Math.abs(product.trend).toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Revenue bar + sold-out warning */}
              <div className="mt-2 flex items-center gap-2.5 pl-7">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-soft ring-1 ring-line/70">
                  <div
                    className="h-full rounded-full bg-olive"
                    style={{ width: `${(product.revenue / peak) * 100}%` }}
                  />
                </div>
                {soldOut && (
                  <span className="shrink-0 text-[10.5px] font-semibold text-[#9A2B22]">
                    Out of stock
                  </span>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
