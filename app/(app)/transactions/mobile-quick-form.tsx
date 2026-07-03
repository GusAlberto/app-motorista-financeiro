'use client'

import { useState } from 'react'
import { Plus, TrendingUp, TrendingDown } from 'lucide-react'
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

  const { state, handleCreateTransaction, clearError } = useTransactionForm()

  const handleFormSuccess = async (transaction: any) => {
    try {
      await handleCreateTransaction(transaction)
      setToast({
        type: 'success',
        message: `${transaction.type === 'income' ? 'Income' : 'Expense'} logged successfully`,
      })
      setShowForm(false)
    } catch (error) {
      setToast({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to save',
      })
    }
  }

  const handleFormError = (error: string) => {
    setToast({
      type: 'error',
      message: error,
    })
  }

  if (!showForm) {
    return (
      <>
        {/* Quick action button */}
        <div className="fixed bottom-6 right-6 z-40 sm:hidden">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg active:shadow-md transition-shadow"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Desktop button */}
        <div className="hidden sm:flex gap-2 mb-6">
          <button
            onClick={() => {
              setActiveTab('income')
              setShowForm(true)
            }}
            className="flex items-center gap-2 flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors h-12"
          >
            <TrendingUp className="w-5 h-5" />
            Log Income
          </button>
          <button
            onClick={() => {
              setActiveTab('expense')
              setShowForm(true)
            }}
            className="flex items-center gap-2 flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors h-12"
          >
            <TrendingDown className="w-5 h-5" />
            Log Expense
          </button>
        </div>

        {/* Toast notifications */}
        {toast && (
          <ToastContainer>
            <Toast
              type={toast.type}
              message={toast.message}
              onClose={() => setToast(null)}
            />
          </ToastContainer>
        )}
      </>
    )
  }

  return (
    <>
      {/* Modal Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={() => setShowForm(false)}
      ></div>

      {/* Modal Content */}
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
        <div
          className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-lg w-full sm:w-full sm:max-w-md max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {activeTab === 'income' ? 'Log Income' : 'Log Expense'}
            </h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Tabs for mobile */}
          <div className="sm:hidden flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('income')}
              className={`flex-1 py-3 font-semibold transition-colors ${
                activeTab === 'income'
                  ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Income
            </button>
            <button
              onClick={() => setActiveTab('expense')}
              className={`flex-1 py-3 font-semibold transition-colors ${
                activeTab === 'expense'
                  ? 'text-red-600 dark:text-red-400 border-b-2 border-red-600 dark:border-red-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Expense
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6">
            {activeTab === 'income' ? (
              <IncomeForm
                onSuccess={handleFormSuccess}
                onError={handleFormError}
                isPending={state.isLoading}
              />
            ) : (
              <ExpenseForm
                onSuccess={handleFormSuccess}
                onError={handleFormError}
                isPending={state.isLoading}
              />
            )}
          </div>

          {/* Close button for mobile */}
          <div className="sm:hidden px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowForm(false)}
              className="w-full py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Toast notifications */}
      {toast && (
        <ToastContainer>
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        </ToastContainer>
      )}
    </>
  )
}
