import { Boxes, LogOut, Menu } from 'lucide-react'
import { NAV_ITEMS } from '../../data/dashboardData.js'
import { NAV_ICONS } from '../../lib/navIcons.js'
import { useAuth } from '../../lib/auth.jsx'
import cn from '../../lib/cn.js'

export default function Sidebar({
  collapsed = false,
  mobileOpen = false,
  active = 'home',
  onToggleCollapse,
  onCloseMobile,
}) {
  const { user, logout } = useAuth()
  const displayName = user?.name || 'Team Member'
  const role = user?.role || 'Store Manager'
  const initial = displayName.trim().charAt(0).toUpperCase() || 'S'

  return (
    <aside
      aria-label="Primary navigation"
      className={cn(
        'fixed inset-y-0 left-0 z-40 h-full w-[280px] max-w-[85vw] transform transition-transform duration-300 lg:static lg:z-auto lg:max-w-none lg:shrink-0 lg:translate-x-0',
        mobileOpen ? 'translate-x-0' : '-translate-x-full',
        collapsed ? 'lg:w-[84px]' : 'lg:w-[236px]',
      )}
    >
      {/* Full-height dark column, flush with the viewport and dashboard header */}
      <div className="flex h-full w-full flex-col overflow-hidden bg-sidebar">
        {/* Brand row — top padding matches the header (py-5) so it aligns with the hero */}
        <div className="flex items-center px-5 pb-2 pt-5">
          {/* Brand block — replaced by the centered toggle when collapsed */}
          <div className={cn('flex items-center gap-2.5', collapsed && 'lg:hidden')}>
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-[10px] bg-sidebar-deep ring-1 ring-white/10">
              <Boxes size={16} className="text-olive" strokeWidth={2.2} aria-hidden="true" />
            </div>
            <span className="whitespace-nowrap text-[12px] font-bold uppercase tracking-[0.16em] text-white">
              ROOT CO.
            </span>
          </div>
          <button
            type="button"
            onClick={mobileOpen ? onCloseMobile : onToggleCollapse}
            aria-label={mobileOpen ? 'Close menu' : collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={mobileOpen}
            title={!mobileOpen && collapsed ? 'Expand sidebar' : undefined}
            className={cn(
              'grid h-8 w-8 shrink-0 place-items-center rounded-[10px] text-[#9A9B93] transition-colors hover:bg-white/5 hover:text-white',
              collapsed ? 'lg:mx-auto' : 'ml-auto',
            )}
          >
            <Menu size={18} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>

        {/* Navigation — real links, hash-routed */}
        <nav className="no-scrollbar mt-4 flex-1 space-y-1 overflow-y-auto px-3" aria-label="Sections">
          {NAV_ITEMS.map((item) => {
            const Icon = NAV_ICONS[item.icon]
            const isActive = active === item.id
            return (
              <a
                key={item.id}
                href={`#/${item.id}`}
                aria-current={isActive ? 'page' : undefined}
                title={collapsed ? item.label : undefined}
                className={cn(
                  'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] transition-colors',
                  collapsed && 'lg:justify-center lg:px-2',
                  isActive
                    ? 'bg-white/[0.08] font-semibold text-white'
                    : 'text-[#A3A49B] hover:bg-white/[0.05] hover:text-white',
                )}
              >
                <span
                  className={cn(
                    'grid h-6 w-6 shrink-0 place-items-center',
                    isActive ? 'text-olive-light' : 'text-[#8E9087] group-hover:text-[#D8D9CF]',
                  )}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.1 : 1.7} aria-hidden="true" />
                </span>
                <span className={cn(collapsed && 'lg:hidden')}>{item.label}</span>
                {item.badge != null && (
                  <span
                    className={cn(
                      'ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-[#F0EDDC] px-1 font-semibold text-[#3A3A2D]',
                      'text-[11px] leading-none',
                      collapsed && 'lg:hidden',
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </a>
            )
          })}
        </nav>

        {/* User footer — reflects the signed-in account */}
        <div className="border-t border-white/[0.07] px-3 py-3">
          <div
            className={cn(
              'flex items-center gap-3 rounded-xl px-2 py-1',
              collapsed && 'lg:justify-center lg:px-0',
            )}
            role="group"
            aria-label="User account"
          >
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#ECEDDA] text-[13px] font-bold text-sidebar">
              {initial}
            </div>
            {!collapsed && (
              <>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-white">{displayName}</p>
                  <p className="truncate text-[11px] text-[#86887f]">{role}</p>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  aria-label="Sign out"
                  title="Sign out"
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[#86887f] transition-colors hover:bg-white/5 hover:text-white"
                >
                  <LogOut size={16} strokeWidth={2} aria-hidden="true" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}