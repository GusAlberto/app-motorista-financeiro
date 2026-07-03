'use client'

/**
 * components/BottomNav.tsx
 *
 * Fixed bottom tab bar — the primary navigation on mobile, where this app
 * is actually used (dashboard mounted, one thumb free). A top navbar link
 * list would sit outside comfortable thumb reach; a bottom bar doesn't.
 * Hidden on md+ where the Navbar's horizontal links take over.
 */

import { LayoutDashboard, Receipt, Settings } from 'lucide-react'
import { InteractiveMenu, type InteractiveMenuItem } from '@/components/ui/modern-mobile-menu'

const TABS: InteractiveMenuItem[] = [
  { href: '/dashboard', label: 'Início', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transações', icon: Receipt },
  { href: '/settings', label: 'Ajustes', icon: Settings },
]

export function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/90 backdrop-blur-lg md:hidden dark:border-slate-800 dark:bg-slate-950/90"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Navegação principal"
    >
      <InteractiveMenu items={TABS} className="mx-auto h-16 max-w-md px-2" />
    </nav>
  )
}
