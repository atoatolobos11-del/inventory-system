import { formatCurrencyShort } from '../../data/dashboardData.js'

/** Minimal shared tooltip for the dashboard charts. */
export default function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null

  const entry = payload[0]

  return (
    <div className="rounded-xl border border-line bg-card px-3.5 py-2.5 shadow-pop">
      {label && <p className="text-[11px] font-medium text-muted">{label}</p>}
      <p className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-text">
        <span className="h-2 w-2 shrink-0 rounded-full bg-olive" aria-hidden="true" />
        {formatCurrencyShort(Number(entry?.value ?? 0))}
      </p>
    </div>
  )
}