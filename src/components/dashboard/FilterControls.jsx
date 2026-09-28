import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { OUTLETS } from '../../data/dashboardData.js'
import cn from '../../lib/cn.js'

const PERIODS = ['Today', 'This Week', 'This Month']

/**
 * Time-period segmented control + outlet dropdown.
 * Both are lightweight, keyboard accessible, and frontend-only.
 */
export default function FilterControls({ period, onPeriodChange, outlet, onOutletChange }) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const onPointerDown = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setOpen(false)
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const selected = OUTLETS.find((o) => o.id === outlet) ?? OUTLETS[0]

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {/* Period segmented control */}
      <div
        role="group"
        aria-label="Time period filter"
        className="inline-flex items-center gap-0.5 rounded-lg border border-line bg-card p-0.5 shadow-sm"
      >
        {PERIODS.map((periodKey) => {
          const isActive = period === periodKey
          return (
            <button
              key={periodKey}
              type="button"
              onClick={() => onPeriodChange(periodKey)}
              aria-pressed={isActive}
              className={cn(
                'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                isActive ? 'bg-sidebar text-white shadow-sm' : 'text-muted hover:text-text',
              )}
            >
              {periodKey}
            </button>
          )
        })}
      </div>

      {/* Outlet dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="inline-flex items-center gap-2 rounded-lg border border-line bg-card px-3 py-[9px] text-xs font-medium text-text shadow-sm transition-colors hover:border-[#C5C7BA]"
        >
          {selected.label}
          <ChevronDown
            size={14}
            strokeWidth={2}
            className={cn('text-muted transition-transform duration-150', open && 'rotate-180')}
            aria-hidden="true"
          />
        </button>

        {open && (
          <ul
            role="listbox"
            aria-label="Select outlet"
            className="shadow-pop absolute right-0 z-30 mt-1.5 w-52 overflow-hidden rounded-xl border border-line bg-card p-1"
          >
            {OUTLETS.map((o) => {
              const isSelected = outlet === o.id
              return (
                <li key={o.id} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onClick={() => {
                      onOutletChange(o.id)
                      setOpen(false)
                    }}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[13px] transition-colors',
                      isSelected
                        ? 'bg-soft font-medium text-text'
                        : 'text-muted hover:bg-soft hover:text-text',
                    )}
                  >
                    <span className="flex-1">{o.label}</span>
                    {isSelected && (
                      <Check size={14} strokeWidth={2.5} className="text-olive" aria-hidden="true" />
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}