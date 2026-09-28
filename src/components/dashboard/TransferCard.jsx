import { ArrowRight, ArrowUpRight, Package, Server, Warehouse } from 'lucide-react'
import ProductIcon from '../products/ProductIcon.jsx'
import { transfer } from '../../data/dashboardData.js'

/**
 * Right-column Transfer card.
 */
export default function TransferCard({ onView }) {
  return (
    <section className="rounded-2xl border border-line bg-card p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-bold tracking-tight text-text">Transfer</h2>
          <p className="mt-1 text-xs leading-relaxed text-muted">{transfer.description}</p>
        </div>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-olive-light/70">
          <Package size={16} strokeWidth={1.9} className="text-olive" aria-hidden="true" />
        </span>
      </div>

      {/* Product row */}
      <div className="mt-4 flex items-center gap-3 rounded-xl border border-line bg-soft/60 p-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-card shadow-sm ring-1 ring-line">
          <ProductIcon name="shirt" size={22} className="text-muted" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold text-text">{transfer.productName}</p>
          <p className="mt-0.5 text-[11.5px] text-muted">{transfer.quantity}</p>
        </div>
      </div>

      {/* Route */}
      <div className="mt-3 flex items-center gap-2 rounded-xl border border-line px-3 py-2.5 text-[11.5px] font-medium text-muted">
        <Warehouse size={14} strokeWidth={1.9} className="shrink-0 text-olive" aria-hidden="true" />
        <span className="truncate">{transfer.from}</span>
        <ArrowRight size={13} strokeWidth={2} className="shrink-0" aria-hidden="true" />
        <Server size={14} strokeWidth={1.9} className="shrink-0 text-olive" aria-hidden="true" />
        <span className="truncate">{transfer.to}</span>
      </div>

      {/* Action */}
      <button
        type="button"
        onClick={onView}
        className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-line py-2 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-muted transition-colors hover:border-olive hover:text-olive"
      >
        View Transfer
        <ArrowUpRight size={13} strokeWidth={2.2} aria-hidden="true" />
      </button>
    </section>
  )
}