import { ShoppingCart } from 'lucide-react'
import { formatNumber } from '../../data/ecommerceData.js'
import cn from '../../lib/cn.js'

/**
 * Conversion funnel — sessions down to purchases.
 * Each row shows the step's volume and its conversion from the previous step.
 */
export default function ConversionFunnel({ stages }) {
  const top = stages[0]?.value ?? 1

  return (
    <ol className="space-y-2.5">
      {stages.map((step, index) => {
        const share = (step.value / top) * 100
        const previous = index > 0 ? stages[index - 1].value : null
        const stepRate = previous ? (step.value / previous) * 100 : 100

        return (
          <li key={step.stage}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[12.5px] font-medium text-text">{step.stage}</span>
              <span className="flex items-baseline gap-2">
                {index > 0 && (
                  <span
                    className={cn(
                      'text-[11px] font-semibold',
                      stepRate < 40 ? 'text-[#9A2B22]' : 'text-muted',
                    )}
                  >
                    {stepRate.toFixed(stepRate < 10 ? 1 : 0)}%
                  </span>
                )}
                <span className="text-[13px] font-bold text-text">{formatNumber(step.value)}</span>
              </span>
            </div>

            {/* Bar — width is the share of top-of-funnel traffic */}
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-soft ring-1 ring-line/70">
              <div
                className="h-full rounded-full bg-olive transition-[width] duration-500"
                style={{ width: `${Math.max(share, 1.5)}%` }}
              />
            </div>
          </li>
        )
      })}

      <li className="flex items-center gap-2 border-t border-line/70 pt-3 text-[11px] leading-snug text-muted">
        <ShoppingCart size={13} strokeWidth={2} className="shrink-0 text-olive" aria-hidden="true" />
        Overall session-to-purchase conversion is{' '}
        <span className="font-semibold text-text">
          {((stages[stages.length - 1].value / top) * 100).toFixed(2)}%
        </span>
      </li>
    </ol>
  )
}
