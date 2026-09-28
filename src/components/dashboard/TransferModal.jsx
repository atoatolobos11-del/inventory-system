import { ArrowRight, CalendarDays, PackageCheck, Server, Warehouse } from 'lucide-react'
import Modal from './Modal.jsx'
import ProductIcon from '../products/ProductIcon.jsx'
import { transfer } from '../../data/dashboardData.js'

/** Modal shown by "View Transfer". */
export default function TransferModal({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="Transfer Details">
      <div className="flex items-center gap-3 rounded-xl border border-line bg-soft/60 p-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-card shadow-sm ring-1 ring-line">
          <ProductIcon name="shirt" size={22} className="text-muted" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold text-text">{transfer.productName}</p>
          <p className="mt-0.5 text-[11.5px] text-muted">{transfer.quantity}</p>
        </div>
      </div>

      <dl className="mt-4 divide-y divide-line/70 rounded-xl border border-line text-sm">
        <Row label="Reference" value={transfer.id} />
        <div className="flex items-center justify-between gap-4 px-4 py-3">
          <dt className="text-muted">Route</dt>
          <dd className="flex items-center gap-2">
            <Warehouse size={14} className="text-olive" aria-hidden="true" />
            <span className="font-medium">{transfer.from}</span>
            <ArrowRight size={13} className="text-muted" aria-hidden="true" />
            <Server size={14} className="text-olive" aria-hidden="true" />
            <span className="font-medium">{transfer.to}</span>
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4 px-4 py-3">
          <dt className="text-muted">Expected</dt>
          <dd className="flex items-center gap-1.5 font-semibold">
            <CalendarDays size={14} className="text-olive" aria-hidden="true" />
            {transfer.expectedDate}
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-line bg-soft px-4 py-3">
        <span className="text-xs text-muted">Status</span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-olive-light px-2.5 py-1 text-[11px] font-semibold text-sidebar">
          <PackageCheck size={13} className="text-olive" aria-hidden="true" />
          {transfer.status}
        </span>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="mt-4 w-full rounded-xl bg-sidebar py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-black"
      >
        Close
      </button>
    </Modal>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <dt className="text-muted">{label}</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  )
}