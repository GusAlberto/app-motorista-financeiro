'use client'

import { useState } from 'react'
import { Plus, TrendingUp, TrendingDown, X } from 'lucide-react'
import { IncomeForm } from '@/components/IncomeForm'
import { ExpenseForm } from '@/components/ExpenseForm'
import { useTransactionForm } from '@/lib/hooks/useTransactionForm'
import { Toast, ToastContainer } from '@/components/Toast'

/**
 * Mobile-optimized quick transaction entry form
 * Provides one-handed accessible form entry with large touch targets
 */
export function MobileQuickForm() {
  const [activeTab, setActiveTab] = useState<'income' | 'expense'>('income')
  const [showForm, setShowForm] = useState(false)
  const [toast, setToast] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  const { state, handleCreateTransaction } = useTransactionForm()

  const handleFormSuccess = async (transaction: any) => {
    try {
      await handleCreateTransaction(transaction)
      setToast({
        type: 'success',
        message: `${transaction.type === 'income' ? 'Ganho' : 'Despesa'} registrado com sucesso`,
      })
      setShowForm(false)
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

  if (!showForm) {
    return (
      <>
        {/* Quick action button (mobile) — sits above the fixed BottomNav */}
        <div className="fixed bottom-24 right-4 z-40 sm:hidden">
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary btn-sheen flex h-14 w-14 items-center justify-center rounded-full shadow-lg shadow-slate-900/30 transition-transform active:scale-95 dark:shadow-black/40"
            aria-label="Nova transação"
          >
            <Plus className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Desktop buttons */}
        <div className="hidden gap-3 sm:flex">
          <button
            onClick={() => {
              setActiveTab('income')
              setShowForm(true)
            }}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            <TrendingUp className="h-5 w-5" aria-hidden="true" />
            Registrar Ganho
          </button>
          <button
            onClick={() => {
              setActiveTab('expense')
              setShowForm(true)
            }}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 font-semibold text-white transition-colors hover:bg-red-700"
          >
            <TrendingDown className="h-5 w-5" aria-hidden="true" />
            Registrar Despesa
          </button>
        </div>

        {toast && (
          <ToastContainer>
            <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
          </ToastContainer>
        )}
      </>
    )
  }

  return (
    <>
      {/* Modal Overlay */}
      <div
        className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm"
        onClick={() => setShowForm(false)}
      />

      {/* Modal Content */}
      <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
        <div
          className="max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-white sm:max-w-md sm:rounded-2xl dark:bg-slate-900"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
              {activeTab === 'income' ? 'Registrar Ganho' : 'Registrar Despesa'}
            </h2>
            <button
              onClick={() => setShowForm(false)}
              className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          {/* Tabs for mobile */}
          <div className="flex border-b border-slate-200 sm:hidden dark:border-slate-800">
            <button
              onClick={() => setActiveTab('income')}
              className={`flex-1 py-3 font-semibold transition-colors ${
                activeTab === 'income'
                  ? 'border-b-2 border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-400'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Ganho
            </button>
            <button
              onClick={() => setActiveTab('expense')}
              className={`flex-1 py-3 font-semibold transition-colors ${
                activeTab === 'expense'
                  ? 'border-b-2 border-red-600 text-red-700 dark:border-red-400 dark:text-red-400'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Despesa
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6">
            {activeTab === 'income' ? (
              <IncomeForm onSuccess={handleFormSuccess} onError={handleFormError} isPending={state.isLoading} />
            ) : (
              <ExpenseForm onSuccess={handleFormSuccess} onError={handleFormError} isPending={state.isLoading} />
            )}
          </div>

          {/* Close button for mobile */}
          <div className="border-t border-slate-200 px-6 py-4 sm:hidden dark:border-slate-800">
            <button
              onClick={() => setShowForm(false)}
              className="w-full rounded-xl bg-slate-100 py-3 font-semibold text-slate-900 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>

      {toast && (
        <ToastContainer>
          <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
        </ToastContainer>
      )}
    </>
  )
}
