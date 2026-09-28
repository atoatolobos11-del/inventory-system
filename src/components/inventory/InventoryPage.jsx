import { useMemo, useState } from 'react'
import { AlertTriangle, ArrowDownUp, Boxes, PackageX, Search, Warehouse } from 'lucide-react'
import ProductIcon from '../products/ProductIcon.jsx'
import StockBadge from '../products/StockBadge.jsx'
import {
  CATEGORIES,
  LOCATIONS,
  PRODUCTS,
  formatCurrency,
  formatNumber,
  parseQty,
  purchaseOrders,
  stockStatus,
  stockTotal,
} from '../../data/dashboardData.js'
import cn from '../../lib/cn.js'

const STATUS_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'ok', label: 'In Stock' },
  { id: 'low', label: 'Low' },
  { id: 'out', label: 'Out' },
]

/** Tone for a single location's count vs the product's reorder level. */
function locationTone(count, reorderLevel) {
  if (count === 0) return 'bg-[#FBEFED] text-[#9A2B22]'
  if (count < reorderLevel) return 'bg-[#F7EDD2] text-[#7A5B12]'
  return 'bg-olive-light/70 text-sidebar'
}

const chipContainer =
  'inline-flex items-center gap-0.5 rounded-lg border border-line bg-card p-0.5 shadow-sm'

/**
 * Inventory page (frontend-only):
 * stock KPIs, low-stock alert, filterable per-location stock table.
 */
export default function InventoryPage() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [category, setCategory] = useState('All')

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return PRODUCTS.filter((product) => {
      const matchesStatus = status === 'all' || stockStatus(product) === status
      const matchesCategory = category === 'All' || product.category === category
      const matchesQuery =
        !q || product.name.toLowerCase().includes(q) || product.sku.toLowerCase().includes(q)
      return matchesStatus && matchesCategory && matchesQuery
    })
  }, [query, status, category])

  const stats = useMemo(() => {
    let units = 0
    let low = 0
    let out = 0
    for (const product of PRODUCTS) {
      units += stockTotal(product)
      const availability = stockStatus(product)
      if (availability === 'low') low += 1
      if (availability === 'out') out += 1
    }
    return { skus: PRODUCTS.length, units, low, out }
  }, [])

  const incoming = useMemo(
    () => purchaseOrders.reduce((sum, order) => sum + parseQty(order.qty), 0),
    [],
  )

  const needsAttention = stats.low + stats.out

  return (
    <div className="space-y-5">
      {/* KPI row */}
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        <StatCard
          icon={Boxes}
          label="Products (SKUs)"
          value={formatNumber(stats.skus)}
          hint="Across the catalog"
        />
        <StatCard
          icon={Warehouse}
          label="Units on Hand"
          value={formatNumber(stats.units)}
          hint="All locations combined"
        />
        <StatCard
          icon={AlertTriangle}
          label="Low Stock"
          value={formatNumber(stats.low)}
          hint="Below reorder level"
          tone={stats.low > 0 ? 'warn' : 'ok'}
        />
        <StatCard
          icon={PackageX}
          label="Out of Stock"
          value={formatNumber(stats.out)}
          hint="Needs restocking"
          tone={stats.out > 0 ? 'danger' : 'ok'}
        />
      </div>

      {/* Low-stock alert */}
      {needsAttention > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-[#E8D9A8] bg-[#FBF6E7] px-4 py-3">
          <AlertTriangle
            size={16}
            strokeWidth={2}
            className="mt-0.5 shrink-0 text-[#7A5B12]"
            aria-hidden="true"
          />
          <p className="text-[13px] leading-relaxed text-[#5A4A1E]">
            <span className="font-semibold">
              {needsAttention} {needsAttention === 1 ? 'item needs' : 'items need'} attention
            </span>
            {stats.low > 0 && (
              <>
                {' — '}
                {stats.low} low on stock
              </>
            )}
            {stats.out > 0 && (
              <>
                {' — '}
                {stats.out} out of stock
              </>
            )}
            . Use the status filters below to review what to reorder.
          </p>
        </div>
      )}

      {/* Stock table */}
      <section className="rounded-2xl border border-line bg-card shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/70 p-5 sm:p-6">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-olive-light/70 text-olive">
              <Warehouse size={15} strokeWidth={2} aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-[15px] font-bold tracking-tight text-text">Stock Overview</h2>
              <p className="mt-0.5 text-xs text-muted">
                Showing {rows.length} of {PRODUCTS.length} products
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-soft px-2.5 py-1 text-[11px] font-semibold text-muted ring-1 ring-line">
              <ArrowDownUp size={12} strokeWidth={2} className="text-olive" aria-hidden="true" />
              {incoming} pcs incoming
            </span>

            {/* Search */}
            <div className="relative">
              <Search
                size={14}
                strokeWidth={2}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted/60"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search name or SKU…"
                aria-label="Search products"
                className="w-52 rounded-lg border border-line bg-soft py-2 pl-8 pr-3 text-[13px] text-text placeholder:text-muted/50 transition focus:border-olive focus:outline-none focus:ring-2 focus:ring-olive/25"
              />
            </div>

            {/* Status filter */}
            <div role="group" aria-label="Stock status filter" className={chipContainer}>
              {STATUS_FILTERS.map(({ id, label }) => {
                const isActive = status === id
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setStatus(id)}
                    aria-pressed={isActive}
                    className={cn(
                      'rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors',
                      isActive ? 'bg-sidebar text-white shadow-sm' : 'text-muted hover:text-text',
                    )}
                  >
                    {label}
                  </button>
                )
              })}
            </div>

            {/* Category filter */}
            <div role="group" aria-label="Category filter" className={cn(chipContainer, 'hidden sm:inline-flex')}>
              {['All', ...CATEGORIES].map((label) => {
                const isActive = category === label
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setCategory(label)}
                    aria-pressed={isActive}
                    className={cn(
                      'rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors',
                      isActive ? 'bg-sidebar text-white shadow-sm' : 'text-muted hover:text-text',
                    )}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-left text-sm">
            <caption className="sr-only">Current stock levels by product and location</caption>
            <thead>
              <tr className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-muted">
                <th scope="col" className="px-5 py-3.5 sm:pl-6">
                  Product
                </th>
                <th scope="col" className="px-4 py-3.5">
                  Category
                </th>
                <th scope="col" className="px-4 py-3.5">
                  Price
                </th>
                <th scope="col" className="px-4 py-3.5">
                  Stock by location
                </th>
                <th scope="col" className="px-4 py-3.5 text-right">
                  Total
                </th>
                <th scope="col" className="px-4 py-3.5">
                  Status
                </th>
                <th scope="col" className="px-5 py-3.5 sm:pr-6">
                  Updated
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/70">
              {rows.map((product) => {
                const total = stockTotal(product)
                const availability = stockStatus(product)
                return (
                  <tr key={product.id} className="transition-colors hover:bg-soft/50">
                    <td className="px-5 py-3.5 sm:pl-6">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-soft text-muted ring-1 ring-line">
                          <ProductIcon name={product.icon} size={19} />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-semibold text-text">
                            {product.name}
                          </p>
                          <p className="text-[11px] text-muted">{product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-[12.5px] text-muted">
                      {product.category}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-[13px] font-semibold text-text">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-1.5">
                        {LOCATIONS.map((location) => {
                          const count = product.stock[location] ?? 0
                          const short = location === 'Main Store' ? 'M' : location === 'Downtown Store' ? 'D' : 'T'
                          return (
                            <span
                              key={location}
                              title={`${location}: ${count} units`}
                              className={cn(
                                'inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold leading-none',
                                locationTone(count, product.reorderLevel),
                              )}
                            >
                              {short}
                              <span className="font-bold">{count}</span>
                            </span>
                          )
                        })}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-right text-[13px] font-bold text-text">
                      {formatNumber(total)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5">
                      <StockBadge status={availability} />
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-[12.5px] text-muted sm:pr-6">
                      {product.updated}
                    </td>
                  </tr>
                )
              })}

              {rows.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <p className="text-sm font-semibold text-text">No products match your filters</p>
                    <p className="mt-1 text-xs text-muted">Try clearing the search or status filter.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, hint, tone = 'ok' }) {
  const iconTone =
    tone === 'warn'
      ? 'bg-[#F7EDD2] text-[#7A5B12]'
      : tone === 'danger'
        ? 'bg-[#FBEFED] text-[#9A2B22]'
        : 'bg-olive-light/70 text-olive'

  return (
    <article className="rounded-2xl border border-line bg-card p-5 shadow-card">
      <div className="flex items-center gap-3">
        <span className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-lg', iconTone)}>
          <Icon size={17} strokeWidth={2} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-[22px] font-bold leading-none tracking-tight text-text">{value}</p>
          <p className="mt-1 text-xs font-medium text-muted">{label}</p>
        </div>
      </div>
      <p className="mt-3 border-t border-line/70 pt-2.5 text-[11px] leading-snug text-muted">
        {hint}
      </p>
    </article>
  )
}