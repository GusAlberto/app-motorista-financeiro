'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { INCOME_CATEGORIES } from '@/lib/validation/transaction'

interface IncomeFormData {
  type: 'income'
  amount: number
  category: string
  description?: string
  transaction_date: string // ISO date string (YYYY-MM-DD) in user's local timezone
}

interface IncomeFormProps {
  onSuccess?: (transaction: IncomeFormData) => void
  onError?: (error: string) => void
  isPending?: boolean
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
    >
      {pending ? (
        <>
          <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          Registrando...
        </>
      ) : (
        'Registrar Ganho'
      )}
    </button>
  )
}

export function IncomeForm({ onSuccess, onError, isPending: externalPending }: IncomeFormProps) {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [category, setCategory] = useState<string>('ride')
  const [amount, setAmount] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (formData: FormData) => {
    // Clear previous errors
    setErrors({})

    try {
      // Create transaction object
      const transaction = {
        type: 'income' as const,
        amount: parseFloat(amount),
        category,
        description: description || undefined,
        transaction_date: date, // Send as ISO string, not Date — server treats as local date
      }

      // Basic validation
      const newErrors: Record<string, string> = {}

      if (!amount || parseFloat(amount) <= 0) {
        newErrors.amount = 'O valor deve ser maior que 0'
      }

      if (!category) {
        newErrors.category = 'Categoria é obrigatória'
      }

      if (!date) {
        newErrors.transaction_date = 'Data é obrigatória'
      }

      // Check if date is in the future using date string comparison
      const todayStr = new Date().toISOString().split('T')[0]
      if (date > todayStr) {
        newErrors.transaction_date = 'A data não pode ser no futuro'
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        onError?.(Object.values(newErrors)[0])
        return
      }

      // Call the server action or API
      // For now, we'll just call the onSuccess callback
      // This will be connected to the server action in Task 1.3
      onSuccess?.(transaction)

      // Reset form
      setAmount('')
      setDescription('')
      setDate(new Date().toISOString().split('T')[0])
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha ao registrar ganho'
      setErrors({ submit: message })
      onError?.(message)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {/* Amount Input */}
      <div className="space-y-2">
        <label htmlFor="amount" className="block text-sm font-semibold text-slate-900 dark:text-white">
          Valor (R$)
        </label>
        <input
          id="amount"
          type="number"
          inputMode="decimal"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          step="0.01"
          min="0.01"
          autoFocus
          className="w-full px-4 py-3 text-lg bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
        />
        {errors.amount && (
          <p className="text-xs text-red-600 dark:text-red-400">{errors.amount}</p>
        )}
      </div>

      {/* Category Select */}
      <div className="space-y-2">
        <label htmlFor="category" className="block text-sm font-semibold text-slate-900 dark:text-white">
          Categoria
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 text-slate-900 dark:text-white"
        >
          {INCOME_CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-xs text-red-600 dark:text-red-400">{errors.category}</p>
        )}
      </div>

      {/* Date Input */}
      <div className="space-y-2">
        <label htmlFor="date" className="block text-sm font-semibold text-slate-900 dark:text-white">
          Data
        </label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 text-slate-900 dark:text-white"
        />
        {errors.transaction_date && (
          <p className="text-xs text-red-600 dark:text-red-400">{errors.transaction_date}</p>
        )}
      </div>

      {/* Description Input */}
      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-semibold text-slate-900 dark:text-white">
          Descrição (opcional)
        </label>
        <textarea
          id="description"
          placeholder="Detalhes da transação..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={500}
          rows={2}
          className="w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 resize-none"
        />
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {description.length}/500
        </p>
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-xl">
          <p className="text-sm text-red-700 dark:text-red-200">{errors.submit}</p>
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-2">
        <SubmitButton />
      </div>
    </form>
  )
}
