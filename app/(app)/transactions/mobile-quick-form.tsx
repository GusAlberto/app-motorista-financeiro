'use client'

import { useState } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { QuickAddModal } from '@/components/QuickAddModal'

/**
 * Transaction quick-entry affordances for the transactions page.
 *
 * On mobile the entry point is the global BottomNav "+" (see
 * components/BottomNav.tsx), so this component only renders the desktop
 * "Registrar Ganho / Despesa" buttons — both of which open the shared
 * QuickAddModal on the matching tab.
 */
export function MobileQuickForm() {
  const [open, setOpen] = useState(false)
  const [initialTab, setInitialTab] = useState<'income' | 'expense'>('income')

  const openWith = (tab: 'income' | 'expense') => {
    setInitialTab(tab)
    setOpen(true)
  }

  return (
    <>
      {/* Desktop buttons — semantic income/expense colors are intentional
          here (financial meaning), not decorative brand color. */}
      <div className="hidden gap-3 sm:flex">
        <button
          onClick={() => openWith('income')}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          <TrendingUp className="h-5 w-5" aria-hidden="true" />
          Registrar Ganho
        </button>
        <button
          onClick={() => openWith('expense')}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 font-semibold text-white transition-colors hover:bg-red-700"
        >
          <TrendingDown className="h-5 w-5" aria-hidden="true" />
          Registrar Despesa
        </button>
      </div>

      <QuickAddModal open={open} onClose={() => setOpen(false)} initialTab={initialTab} />
    </>
  )
}
