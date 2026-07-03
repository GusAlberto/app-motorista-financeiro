'use client'

import { useState } from 'react'
import { AlertCircle, X } from 'lucide-react'
import type { Database } from '@/types/database'

type Transaction = Database['public']['Tables']['transactions']['Row']

interface DeleteTransactionConfirmProps {
  transaction: Transaction
  isOpen: boolean
  onClose: () => void
  onConfirm: (id: string) => Promise<void>
  isPending?: boolean
}

export function DeleteTransactionConfirm({
  transaction,
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: DeleteTransactionConfirmProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string>('')

  const handleDelete = async () => {
    setError('')
    setIsDeleting(true)

    try {
      await onConfirm(transaction.id)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao excluir transação')
    } finally {
      setIsDeleting(false)
    }
  }

  if (!isOpen) return null

  const amount = `R$ ${transaction.amount.toFixed(2).replace('.', ',')}`
  const type = transaction.type === 'income' ? 'Ganho' : 'Despesa'

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" aria-hidden="true" />
            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">Excluir transação?</h2>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-slate-400" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-slate-600 dark:text-slate-300">
            Você está prestes a excluir esta transação. Esta ação pode ser desfeita.
          </p>

          {/* Transaction details */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Tipo</span>
              <span className="font-semibold text-slate-900 dark:text-white">{type}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Categoria</span>
              <span className="font-semibold text-slate-900 dark:text-white capitalize">
                {transaction.category.replace('_', ' ')}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
              <span className="text-sm text-slate-600 dark:text-slate-400">Valor</span>
              <span
                className={`text-lg font-bold ${
                  transaction.type === 'income'
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'text-red-700 dark:text-red-400'
                }`}
              >
                {transaction.type === 'income' ? '+' : '-'}{amount}
              </span>
            </div>
            {transaction.description && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="text-sm text-slate-600 dark:text-slate-400">Descrição</span>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                  {transaction.description}
                </p>
              </div>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-xl">
              <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Warning */}
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-xl">
            <p className="text-sm text-yellow-700 dark:text-yellow-200">
              Esta transação será marcada como excluída e pode ser recuperada se necessário.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Excluindo...
              </>
            ) : (
              'Excluir'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
