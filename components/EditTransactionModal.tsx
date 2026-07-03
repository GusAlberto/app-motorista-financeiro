'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/lib/validation/transaction'
import type { Database } from '@/types/database'

type Transaction = Database['public']['Tables']['transactions']['Row']

interface EditTransactionModalProps {
  transaction: Transaction
  isOpen: boolean
  onClose: () => void
  onSave: (id: string, data: any) => Promise<void>
  isPending?: boolean
}

export function EditTransactionModal({
  transaction,
  isOpen,
  onClose,
  onSave,
  isPending,
}: EditTransactionModalProps) {
  const [amount, setAmount] = useState(transaction.amount.toString())
  const [category, setCategory] = useState(transaction.category)
  const [description, setDescription] = useState(transaction.description || '')
  const [transactionDate, setTransactionDate] = useState(
    transaction.transaction_date.split('T')[0]
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)

  const categories =
    transaction.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setIsSaving(true)

    try {
      // Validate
      const newErrors: Record<string, string> = {}

      if (!amount || parseFloat(amount) <= 0) {
        newErrors.amount = 'O valor deve ser maior que 0'
      }

      if (!category) {
        newErrors.category = 'Categoria é obrigatória'
      }

      if (new Date(transactionDate) > new Date()) {
        newErrors.transactionDate = 'A data não pode ser no futuro'
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        setIsSaving(false)
        return
      }

      // Call onSave
      await onSave(transaction.id, {
        amount: parseFloat(amount),
        category,
        description: description || undefined,
        transaction_date: new Date(transactionDate),
      })

      onClose()
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : 'Falha ao salvar transação',
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
            Editar {transaction.type === 'income' ? 'Ganho' : 'Despesa'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Amount */}
          <div className="space-y-2">
            <label htmlFor="amount" className="block text-sm font-semibold text-slate-900 dark:text-white">
              Valor (R$)
            </label>
            <input
              id="amount"
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              min="0.01"
              autoFocus
              className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white"
            />
            {errors.amount && (
              <p className="text-xs text-red-600 dark:text-red-400">{errors.amount}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-semibold text-slate-900 dark:text-white">
              Categoria
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-xs text-red-600 dark:text-red-400">{errors.category}</p>
            )}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label htmlFor="date" className="block text-sm font-semibold text-slate-900 dark:text-white">
              Data
            </label>
            <input
              id="date"
              type="date"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white"
            />
            {errors.transactionDate && (
              <p className="text-xs text-red-600 dark:text-red-400">{errors.transactionDate}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-semibold text-slate-900 dark:text-white">
              Descrição (opcional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={2}
              className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white resize-none"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">{description.length}/500</p>
          </div>

          {/* Error */}
          {errors.submit && (
            <div className="p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-xl">
              <p className="text-sm text-red-700 dark:text-red-200">{errors.submit}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="btn-primary btn-sheen flex-1 px-4 py-2 font-semibold rounded-xl transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                  Salvando...
                </>
              ) : (
                'Salvar Alterações'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
