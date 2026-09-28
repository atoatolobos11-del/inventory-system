import { ArrowRight } from 'lucide-react'
import { NAV_ITEMS } from '../../data/dashboardData.js'
import { NAV_ICONS } from '../../lib/navIcons.js'

/** Short copy shown on each future section's placeholder page. */
const SECTION_BLURB = {
  sell: 'Point-of-sale transactions and daily checkout flows.',
  reporting: 'Analytics, trends and exportable reports.',
  catalog: 'Browse and manage the full product catalog.',
  inventory: 'Stock levels, movements and transfer requests.',
  customers: 'Customer profiles and purchase history.',
  setup: 'Store configuration, users and preferences.',
}

/**
 * Placeholder page for future modules (Sell, Reporting, Catalog, ...).
 * Navigation is fully wired; the modules arrive in later releases.
 */
export default function SectionPlaceholder({ sectionId }) {
  const section = NAV_ITEMS.find((item) => item.id === sectionId)
  if (!section) return null

  const Icon = NAV_ICONS[section.icon]

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl border border-line bg-card p-8 shadow-card">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-olive-light/70 text-olive">
          <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-xl font-bold tracking-tight text-text">{section.label}</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">{SECTION_BLURB[section.id] ?? ''}</p>

        <span className="mt-4 inline-flex items-center rounded-full bg-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted ring-1 ring-line">
          Coming in a later release
        </span>

        <p className="mt-6 border-t border-line/70 pt-4 text-[13px] leading-relaxed text-muted">
          This area isn't part of the first frontend-only release, but its navigation is fully wired.
          <a
            href="#/home"
            className="ml-2 inline-flex items-center gap-0.5 font-semibold text-olive hover:underline"
          >
            Back to the dashboard
            <ArrowRight size={13} strokeWidth={2} aria-hidden="true" />
          </a>
        </p>
      </div>
    </div>
  )
}