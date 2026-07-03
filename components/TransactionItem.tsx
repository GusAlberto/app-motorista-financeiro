'use client'

import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/lib/validation/transaction'
import type { Database } from '@/types/database'

type Transaction = Database['public']['Tables']['transactions']['Row']

// Lookup map: category value -> Portuguese label
const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES].map((c) => [c.value, c.label])
)

interface TransactionItemProps {
  transaction: Transaction
  runningBalance: number
  onEdit?: (transaction: Transaction) => void
  onDelete?: (id: string) => void
}

/**
 * Format currency to Brazilian Real
 */
function formatCurrency(amount: number): string {
  return `R$ ${amount.toFixed(2).replace('.', ',')}`
}

/**
 * Format category name to its Portuguese label (fallback: title-case the raw value)
 */
function formatCategory(category: string): string {
  return (
    CATEGORY_LABELS[category] ||
    category
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  )
}

export function TransactionItem({
  transaction,
  runningBalance,
  onEdit,
  onDelete,
}: TransactionItemProps) {
  const [showActions, setShowActions] = useState(false)

  const isIncome = transaction.type === 'income'
  const sign = isIncome ? '+' : '-'

  return (
    <div
      className="flex items-center justify-between gap-4 px-4 py-4 transition-colors hover:bg-slate-50 sm:px-6 dark:hover:bg-slate-800/60"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Left side: Category and description — a single restrained
          neutral dot, not a per-category rainbow. The type (income/expense)
          already carries the real color signal via the amount below. */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div
          className={`h-2 w-2 flex-shrink-0 rounded-full ${isIncome ? 'bg-emerald-500' : 'bg-red-500'}`}
          aria-hidden="true"
        />

        <div className="min-w-0 flex-1">
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {formatCategory(transaction.category)}
          </span>
          {transaction.description && (
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              {transaction.description}
            </p>
          )}
        </div>
      </div>

      {/* Center: Time */}
      <div className="flex-shrink-0 text-xs text-slate-500 dark:text-slate-400">
        {new Date(transaction.transaction_date).toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>

      {/* Right side: Amount and actions */}
      <div className="flex flex-shrink-0 items-center gap-2">
        <div className="min-w-[92px] text-right">
          <p
            className={`text-sm font-bold tabular-nums ${
              isIncome ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'
            }`}
          >
            {sign}
            {formatCurrency(transaction.amount)}
          </p>
        </div>

        {/* Actions (desktop: show on hover; mobile: always visible) */}
        <div className={`flex items-center gap-1 transition-opacity sm:opacity-0 ${showActions ? 'sm:opacity-100' : ''}`}>
          <button
            onClick={() => onEdit?.(transaction)}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label={`Editar transação: ${formatCategory(transaction.category)}`}
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            onClick={() => onDelete?.(transaction.id)}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-700 dark:text-slate-400 dark:hover:text-red-400"
            aria-label={`Excluir transação: ${formatCategory(transaction.category)}`}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
