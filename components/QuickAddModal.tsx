'use client'

/**
 * components/QuickAddModal.tsx
 *
 * Controlled bottom-sheet / centered modal for logging a transaction
 * (income or expense). Extracted from the transactions page so the same
 * flow can be opened from anywhere — most importantly the global mobile
 * BottomNav "+" action — without navigating first. Stays mounted by its
 * parent so the success toast survives the modal closing; `open` only
 * gates the sheet itself.
 */

import { useState } from 'react'
import { TrendingUp, TrendingDown, X } from 'lucide-react'
import { IncomeForm } from '@/components/IncomeForm'
import { ExpenseForm } from '@/components/ExpenseForm'
import { useTransactionForm } from '@/lib/hooks/useTransactionForm'
import { Toast, ToastContainer } from '@/components/Toast'

interface QuickAddModalProps {
  open: boolean
  onClose: () => void
  /** Which tab the sheet opens on. Defaults to income. */
  initialTab?: 'income' | 'expense'
}

export function QuickAddModal({ open, onClose, initialTab = 'income' }: QuickAddModalProps) {
  const [activeTab, setActiveTab] = useState<'income' | 'expense'>(initialTab)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const { state, handleCreateTransaction } = useTransactionForm()

  // Keep the sheet's tab in sync with the caller's intent each time it opens
  // (e.g. desktop "Registrar Despesa" should land on the expense tab).
  const [wasOpen, setWasOpen] = useState(false)
  if (open && !wasOpen) {
    setWasOpen(true)
    setActiveTab(initialTab)
  } else if (!open && wasOpen) {
    setWasOpen(false)
  }

  const handleFormSuccess = async (transaction: any) => {
    try {
      await handleCreateTransaction(transaction)
      setToast({
        type: 'success',
        message: `${transaction.type === 'income' ? 'Ganho' : 'Despesa'} registrado com sucesso`,
      })
      onClose()
    } catch (error) {
      setToast({
        type: 'error',
        message: error instanceof Error ? error.message : 'Falha ao salvar',
      })
    }
  }

  const handleFormError = (error: string) => {
    setToast({ type: 'error', message: error })
  }

  return (
    <>
      {open && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sheet (bottom on mobile, centered card on desktop) */}
          <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
            <div
              className="max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-white sm:max-w-md sm:rounded-2xl dark:bg-slate-900"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={activeTab === 'income' ? 'Registrar ganho' : 'Registrar despesa'}
            >
              {/* Header */}
              <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
                <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                  {activeTab === 'income' ? 'Registrar Ganho' : 'Registrar Despesa'}
                </h2>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  aria-label="Fechar"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              {/* Income / Expense tabs — grayscale active state (the
                  emerald/red stay inside the forms' own semantics). */}
              <div className="flex border-b border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setActiveTab('income')}
                  className={`flex flex-1 items-center justify-center gap-2 py-3 font-semibold transition-colors ${
                    activeTab === 'income'
                      ? 'border-b-2 border-slate-900 text-slate-900 dark:border-white dark:text-white'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <TrendingUp className="h-4 w-4" aria-hidden="true" />
                  Ganho
                </button>
                <button
                  onClick={() => setActiveTab('expense')}
                  className={`flex flex-1 items-center justify-center gap-2 py-3 font-semibold transition-colors ${
                    activeTab === 'expense'
                      ? 'border-b-2 border-slate-900 text-slate-900 dark:border-white dark:text-white'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <TrendingDown className="h-4 w-4" aria-hidden="true" />
                  Despesa
                </button>
              </div>

              {/* Form */}
              <div className="p-6">
                {activeTab === 'income' ? (
                  <IncomeForm onSuccess={handleFormSuccess} onError={handleFormError} isPending={state.isLoading} />
                ) : (
                  <ExpenseForm onSuccess={handleFormSuccess} onError={handleFormError} isPending={state.isLoading} />
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {toast && (
        <ToastContainer>
          <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
        </ToastContainer>
      )}
    </>
  )
}
