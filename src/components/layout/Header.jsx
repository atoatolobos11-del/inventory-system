import { Menu } from 'lucide-react'
import FilterControls from '../dashboard/FilterControls.jsx'

export default function Header({
  onOpenMenu,
  headingLines = ["Hi, here's what's happening", 'in your stores'],
  showFilters = true,
  period,
  onPeriodChange,
  outlet,
  onOutletChange,
}) {
  return (
    <header className="border-b border-line/70 bg-page-bg">
      <div className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-5 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Open menu"
            className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-card text-text shadow-sm lg:hidden"
          >
            <Menu size={18} strokeWidth={2} aria-hidden="true" />
          </button>
          <h1 className="text-[20px] font-bold leading-snug tracking-tight text-text sm:text-[22px]">
            {headingLines.map((line, index) => (
              <span key={index} className={index > 0 ? 'block' : undefined}>
                {line}
              </span>
            ))}
          </h1>
        </div>
        {showFilters && (
          <FilterControls
            period={period}
            onPeriodChange={onPeriodChange}
            outlet={outlet}
            onOutletChange={onOutletChange}
          />
        )}
      </div>
    </header>
  )
}