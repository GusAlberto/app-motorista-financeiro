'use client'

import { useState } from 'react'
import { Edit2, Trash2 } from 'lucide-react'
import type { Database } from '@/types/database'

type Transaction = Database['public']['Tables']['transactions']['Row']

interface TransactionItemProps {
  transaction: Transaction
  runningBalance: number
  onEdit?: (transaction: Transaction) => void
  onDelete?: (id: string) => void
}

/**
 * Get category color based on type and category
 */
function getCategoryColor(
  type: 'income' | 'expense',
  category: string
): { bg: string; text: string; dot: string } {
  const incomeColors: Record<string, { bg: string; text: string; dot: string }> = {
    ride: { bg: 'bg-blue-50 dark:bg-blue-900', text: 'text-blue-700 dark:text-blue-200', dot: 'bg-blue-500' },
    bonus: { bg: 'bg-purple-50 dark:bg-purple-900', text: 'text-purple-700 dark:text-purple-200', dot: 'bg-purple-500' },
    other_income: {
      bg: 'bg-cyan-50 dark:bg-cyan-900',
      text: 'text-cyan-700 dark:text-cyan-200',
      dot: 'bg-cyan-500',
    },
  }

  const expenseColors: Record<string, { bg: string; text: string; dot: string }> = {
    fuel: { bg: 'bg-orange-50 dark:bg-orange-900', text: 'text-orange-700 dark:text-orange-200', dot: 'bg-orange-500' },
    maintenance: {
      bg: 'bg-yellow-50 dark:bg-yellow-900',
      text: 'text-yellow-700 dark:text-yellow-200',
      dot: 'bg-yellow-500',
    },
    tolls: { bg: 'bg-indigo-50 dark:bg-indigo-900', text: 'text-indigo-700 dark:text-indigo-200', dot: 'bg-indigo-500' },
    parking: { bg: 'bg-pink-50 dark:bg-pink-900', text: 'text-pink-700 dark:text-pink-200', dot: 'bg-pink-500' },
    car_wash: { bg: 'bg-teal-50 dark:bg-teal-900', text: 'text-teal-700 dark:text-teal-200', dot: 'bg-teal-500' },
    insurance: { bg: 'bg-rose-50 dark:bg-rose-900', text: 'text-rose-700 dark:text-rose-200', dot: 'bg-rose-500' },
    other_expense: {
      bg: 'bg-slate-50 dark:bg-slate-900',
      text: 'text-slate-700 dark:text-slate-200',
      dot: 'bg-slate-500',
    },
  }

  const colors = type === 'income' ? incomeColors : expenseColors

  return colors[category] || colors[Object.keys(colors)[0]]
}

/**
 * Format currency to Brazilian Real
 */
function formatCurrency(amount: number): string {
  return `R$ ${amount.toFixed(2).replace('.', ',')}`
}

/**
 * Format category name
 */
function formatCategory(category: string): string {
  return category
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function TransactionItem({
  transaction,
  runningBalance,
  onEdit,
  onDelete,
}: TransactionItemProps) {
  const [showActions, setShowActions] = useState(false)

  const colors = getCategoryColor(transaction.type, transaction.category)
  const sign = transaction.type === 'income' ? '+' : '-'

  return (
    <div
      className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between gap-4"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Left side: Category and description */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {/* Category icon/dot */}
        <div className={`${colors.dot} w-3 h-3 rounded-full flex-shrink-0`}></div>

        {/* Category and description */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-semibold ${colors.text}`}>
              {formatCategory(transaction.category)}
            </span>
          </div>
          {transaction.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {transaction.description}
            </p>
          )}
        </div>
      </div>

      {/* Center: Time */}
      <div className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
        {new Date(transaction.transaction_date).toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>

      {/* Right side: Amount and actions */}
      <div className="flex items-center gap-4 flex-shrink-0">
        {/* Amount */}
        <div className="text-right min-w-[100px]">
          <p
            className={`text-sm font-bold ${
              transaction.type === 'income'
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {sign}{formatCurrency(transaction.amount)}
          </p>
        </div>

        {/* Actions (mobile: always show, desktop: on hover) */}
        <div className="hidden sm:flex items-center gap-2">
          {showActions && (
            <>
              <button
                onClick={() => onEdit?.(transaction)}
                className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                title="Edit transaction"
              >
                <Edit2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </button>
              <button
                onClick={() => onDelete?.(transaction.id)}
                className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                title="Delete transaction"
              >
                <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
              </button>
            </>
          )}
        </div>

        {/* Mobile actions button */}
        <div className="sm:hidden flex items-center gap-2">
          <button
            onClick={() => onEdit?.(transaction)}
            className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
          >
            <Edit2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </button>
          <button
            onClick={() => onDelete?.(transaction.id)}
            className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
          </button>
        </div>
      </div>
    </div>
  )
}
