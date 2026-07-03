'use client'

/**
 * components/BottomNav.tsx
 *
 * Fixed bottom tab bar — the primary navigation on mobile, where this app
 * is actually used (dashboard mounted, one thumb free). A top navbar link
 * list would sit outside comfortable thumb reach; a bottom bar doesn't.
 * Hidden on md+ where the Navbar's horizontal links take over.
 */

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Receipt, Settings } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const TABS = [
  { href: '/dashboard', label: 'Início', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transações', icon: Receipt },
  { href: '/settings', label: 'Ajustes', icon: Settings },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/90 backdrop-blur-lg md:hidden dark:border-slate-800 dark:bg-slate-950/90"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Navegação principal"
    >
      <div className="mx-auto flex h-16 max-w-md items-stretch justify-around px-2">
        {TABS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname?.startsWith(`${href}/`)
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex min-w-[64px] flex-1 flex-col items-center justify-center gap-1 rounded-lg text-xs font-medium transition-colors',
                isActive
                  ? 'text-slate-900 dark:text-white'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300',
              )}
            >
              <Icon className={cn('h-5 w-5', isActive && 'fill-slate-900/10 dark:fill-white/10')} strokeWidth={isActive ? 2.25 : 2} aria-hidden="true" />
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
