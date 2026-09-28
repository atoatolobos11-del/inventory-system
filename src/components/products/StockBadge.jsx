import { STOCK_STATUS } from '../../data/dashboardData.js'
import cn from '../../lib/cn.js'

/**
 * Availability pill shared by the Sell and Inventory pages.
 * `count` renders "In Stock · 26"; without it the status label only.
 */
export default function StockBadge({ status = 'ok', count, className }) {
  const meta = STOCK_STATUS[status] ?? STOCK_STATUS.ok
  const label = count != null ? `${meta.label} · ${count}` : meta.label

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[10.5px] font-semibold leading-none',
        meta.badge,
        className,
      )}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-70" aria-hidden="true" />
      {label}
    </span>
  )
}