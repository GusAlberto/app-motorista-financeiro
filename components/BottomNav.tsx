'use client'

/**
 * components/BottomNav.tsx
 *
 * Fixed bottom tab bar — the primary navigation on mobile, where this app
 * is actually used (dashboard mounted, one thumb free). A top navbar link
 * list would sit outside comfortable thumb reach; a bottom bar doesn't.
 * Hidden on md+ where the Navbar's horizontal links take over.
 *
 * The raised "+" in the middle is the app's core action — logging a
 * ganho/despesa — so it's promoted out of the flat tab row into an
 * elevated, filled, sheen-on-press button that opens the quick-add sheet
 * from ANY app page (dashboard, ajustes) without navigating first.
 */

import { useState } from 'react'
import { LayoutDashboard, Receipt, Settings, Plus } from 'lucide-react'
import { InteractiveMenu, type InteractiveMenuItem } from '@/components/ui/modern-mobile-menu'
import { QuickAddModal } from '@/components/QuickAddModal'

const TABS: InteractiveMenuItem[] = [
  { href: '/dashboard', label: 'Início', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transações', icon: Receipt },
  { href: '/settings', label: 'Ajustes', icon: Settings },
]

export function BottomNav() {
  const [addOpen, setAddOpen] = useState(false)

  const quickAddButton = (
    <button
      type="button"
      onClick={() => setAddOpen(true)}
      aria-label="Registrar ganho ou despesa"
      className={[
        'btn-primary btn-sheen',
        'flex h-12 w-12 shrink-0 -translate-y-2 items-center justify-center rounded-full',
        'shadow-lg shadow-slate-900/30 ring-4 ring-white transition-transform',
        'hover:-translate-y-2.5 active:translate-y-0 active:scale-95',
        'dark:shadow-black/50 dark:ring-slate-950',
      ].join(' ')}
    >
      <Plus className="h-6 w-6" strokeWidth={2.5} aria-hidden="true" />
    </button>
  )

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/90 backdrop-blur-lg md:hidden dark:border-slate-800 dark:bg-slate-950/90"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        aria-label="Navegação principal"
      >
        <InteractiveMenu items={TABS} centerAction={quickAddButton} className="mx-auto h-16 max-w-md px-2" />
      </nav>

      <QuickAddModal open={addOpen} onClose={() => setAddOpen(false)} />
    </>
  )
}
