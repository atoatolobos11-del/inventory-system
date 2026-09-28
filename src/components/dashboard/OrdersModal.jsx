import Modal from './Modal.jsx'
import ProductIcon from '../products/ProductIcon.jsx'
import { purchaseOrders, purchaseOrdersSummary } from '../../data/dashboardData.js'

/** Modal shown by "View Dispatched Orders". */
export default function OrdersModal({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="Dispatched Orders">
      <p className="text-xs leading-relaxed text-muted">{purchaseOrdersSummary.description}</p>

      <ul className="no-scrollbar mt-4 max-h-72 space-y-2 overflow-y-auto pr-1">
        {purchaseOrders.map((order) => (
          <li
            key={order.id}
            className="flex items-center gap-3 rounded-xl border border-line bg-soft/50 px-3 py-2.5"
          >
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-card ring-1 ring-line">
              <ProductIcon name={order.icon} size={18} className="text-muted" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-text">{order.name}</p>
              <p className="mt-0.5 truncate text-[11px] text-muted">
                {order.id} · from {order.from}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-olive-light px-2.5 py-1 text-[10.5px] font-semibold text-sidebar">
              {order.qty}
            </span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onClose}
        className="mt-5 w-full rounded-xl bg-sidebar py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-black"
      >
        Close
      </button>
    </Modal>
  )
}