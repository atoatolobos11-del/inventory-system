import cn from '../../lib/cn.js'

/**
 * Reusable stat block: small muted label, bold value, optional detail line.
 */
export default function Metric({ label, value, detail, valueClassName, className }) {
  return (
    <div className={cn(className)}>
      <p className="text-xs font-medium leading-tight text-muted">{label}</p>
      <p className={cn('mt-1.5 text-[22px] font-bold leading-none tracking-tight text-text', valueClassName)}>
        {value}
      </p>
      {detail && <p className="mt-2 text-[11px] leading-relaxed text-muted">{detail}</p>}
    </div>
  )
}