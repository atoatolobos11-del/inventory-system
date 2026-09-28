import { ArrowUpRight, BadgeCheck } from 'lucide-react'
import ProductIcon from '../products/ProductIcon.jsx'
import { purchaseOrders, purchaseOrdersSummary } from '../../data/dashboardData.js'

/**
 * Right-column Purchase Orders card with a horizontal product thumbnail row.
 */
export default function PurchaseOrdersCard({ onView }) {
  return (
    <section className="rounded-2xl border border-line bg-card p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-bold tracking-tight text-text">Purchase Orders</h2>
          <p className="mt-1 text-xs leading-relaxed text-muted">{purchaseOrdersSummary.description}</p>
        </div>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-olive-light/70">
          <BadgeCheck size={16} strokeWidth={1.9} className="text-olive" aria-hidden="true" />
        </span>
      </div>

      {/* Product thumbnail row */}
      <ul className="mt-4 flex flex-wrap gap-2.5" aria-label="Dispatched products">
        {purchaseOrders.map((order) => (
          <li
            key={order.id}
            title={`${order.name} — ${order.qty}`}
            className="group relative"
          >
            <div
              role="img"
              aria-label={`${order.name}, ${order.qty}`}
              className="grid h-11 w-11 place-items-center rounded-lg bg-soft text-muted ring-1 ring-line transition-colors group-hover:text-olive"
            >
              <ProductIcon name={order.icon} size={20} />
            </div>
            <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-sidebar px-1 text-[9px] font-semibold leading-none text-white">
              {order.qty.replace(' pcs', '')}
            </span>
          </li>
        ))}
      </ul>

      {/* Action */}
      <button
        type="button"
        onClick={onView}
        className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-line py-2 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-muted transition-colors hover:border-olive hover:text-olive"
      >
        View Dispatched Orders
        <ArrowUpRight size={13} strokeWidth={2.2} aria-hidden="true" />
      </button>
    </section>
  )
}