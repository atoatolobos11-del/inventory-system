import { useMemo, useState } from 'react'
import { ORDER_STATUS, formatCurrency } from '../../data/ecommerceData.js'
import cn from '../../lib/cn.js'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'open', label: 'Needs action' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'delivered', label: 'Delivered' },
]

/** Statuses that still need the merchant to do something. */
const OPEN_STATUSES = new Set(['unfulfilled', 'processing'])

/**
 * Recent online orders — the merchant's queue.
 * Filterable by fulfilment state; defaults to showing everything.
 */
export default function RecentOrders({ orders }) {
  const [filter, setFilter] = useState('all')

  const rows = useMemo(() => {
    if (filter === 'all') return orders
    if (filter === 'open') return orders.filter((order) => OPEN_STATUSES.has(order.status))
    return orders.filter((order) => order.status === filter)
  }, [orders, filter])

  return (
    <section className="rounded-2xl border border-line bg-card shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/70 p-5 sm:p-6">
        <div>
          <h2 className="text-[15px] font-bold tracking-tight text-text">Recent Orders</h2>
          <p className="mt-0.5 text-xs text-muted">
            Showing {rows.length} of {orders.length} most recent orders
          </p>
        </div>

        <div
          role="group"
          aria-label="Filter orders by status"
          className="inline-flex items-center gap-0.5 rounded-lg border border-line bg-card p-0.5 shadow-sm"
        >
          {FILTERS.map(({ id, label }) => {
            const isActive = filter === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => setFilter(id)}
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

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <caption className="sr-only">Recent online orders and their fulfilment status</caption>
          <thead>
            <tr className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-muted">
              <th scope="col" className="px-5 py-3.5 sm:pl-6">Order</th>
              <th scope="col" className="px-4 py-3.5">Customer</th>
              <th scope="col" className="px-4 py-3.5">Channel</th>
              <th scope="col" className="px-4 py-3.5 text-right">Items</th>
              <th scope="col" className="px-4 py-3.5 text-right">Total</th>
              <th scope="col" className="px-4 py-3.5">Status</th>
              <th scope="col" className="px-5 py-3.5 sm:pr-6">Placed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/70">
            {rows.map((order) => {
              const status = ORDER_STATUS[order.status]
              return (
                <tr key={order.id} className="transition-colors hover:bg-soft/50">
                  <td className="whitespace-nowrap px-5 py-3.5 text-[13px] font-semibold text-text sm:pl-6">
                    {order.id}
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="truncate text-[13px] font-medium text-text">{order.customer}</p>
                    <p className="truncate text-[11px] text-muted">
                      {order.email} · {order.destination}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-[12.5px] text-muted">
                    {order.channel}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-right text-[13px] text-muted">
                    {order.items}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-right text-[13px] font-bold text-text">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5">
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none ring-1 ring-black/[0.04]',
                        status.badge,
                      )}
                    >
                      {status.label}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-[12.5px] text-muted sm:pr-6">
                    {order.placed}
                  </td>
                </tr>
              )
            })}

            {rows.length === 0 && (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center">
                  <p className="text-sm font-semibold text-text">No orders in this state</p>
                  <p className="mt-1 text-xs text-muted">Try a different filter above.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
