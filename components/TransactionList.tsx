'use client'

import { useMemo, useState } from 'react'
import { TransactionItem } from '@/components/TransactionItem'
import { DeleteTransactionConfirm } from '@/components/DeleteTransactionConfirm'
import { EditTransactionModal } from '@/components/EditTransactionModal'
import { useTransactionForm } from '@/lib/hooks/useTransactionForm'
import type { Database } from '@/types/database'

type Transaction = Database['public']['Tables']['transactions']['Row']

interface TransactionListProps {
  transactions: Transaction[]
  period: string
  type: string
  category: string
  search: string
}

/**
 * Calculate the date range for a period
 */
function getPeriodDateRange(period: string): { start: Date; end: Date } {
  const end = new Date()
  const start = new Date()

  switch (period) {
    case 'today':
      start.setHours(0, 0, 0, 0)
      end.setHours(23, 59, 59, 999)
      break
    case 'week':
      const day = end.getDay()
      const diff = end.getDate() - day + (day === 0 ? -6 : 1)
      start.setDate(diff)
      start.setHours(0, 0, 0, 0)
      end.setHours(23, 59, 59, 999)
      break
    case 'month':
      start.setDate(1)
      start.setHours(0, 0, 0, 0)
      end.setHours(23, 59, 59, 999)
      break
    case 'year':
      start.setMonth(0, 1)
      start.setHours(0, 0, 0, 0)
      end.setHours(23, 59, 59, 999)
      break
    default:
      start.setDate(1)
      start.setHours(0, 0, 0, 0)
      end.setHours(23, 59, 59, 999)
  }

  return { start, end }
}

/**
 * Filter and sort transactions based on current filters
 */
function filterTransactions(
  transactions: Transaction[],
  period: string,
  type: string,
  category: string,
  search: string
): Transaction[] {
  const { start, end } = getPeriodDateRange(period)

  return transactions.filter((tx) => {
    // Filter by period
    const txDate = new Date(tx.transaction_date)
    if (txDate < start || txDate > end) return false

    // Filter by type
    if (type !== 'all' && tx.type !== type) return false

    // Filter by category
    if (category && tx.category !== category) return false

    // Filter by search (description or category)
    if (search) {
      const searchLower = search.toLowerCase()
      const matchesCategory = tx.category.toLowerCase().includes(searchLower)
      const matchesDescription = (tx.description || '').toLowerCase().includes(searchLower)
      if (!matchesCategory && !matchesDescription) return false
    }

    return true
  })
}

/**
 * Group transactions by date
 */
function groupByDate(transactions: Transaction[]): Map<string, Transaction[]> {
  const grouped = new Map<string, Transaction[]>()

  transactions.forEach((tx) => {
    const dateStr = new Date(tx.transaction_date).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    if (!grouped.has(dateStr)) {
      grouped.set(dateStr, [])
    }

    grouped.get(dateStr)!.push(tx)
  })

  return grouped
}

/**
 * Calculate running balance
 */
function calculateRunningBalance(transactions: Transaction[]): Map<string, number> {
  const balances = new Map<string, number>()
  let balance = 0

  // Process in reverse order (newest to oldest) to calculate running balance
  const reversedTxs = [...transactions].reverse()

  reversedTxs.forEach((tx) => {
    const amount = tx.type === 'income' ? tx.amount : -tx.amount
    balance += amount

    balances.set(tx.id, balance)
  })

  return balances
}

export function TransactionList({
  transactions,
  period,
  type,
  category,
  search,
}: TransactionListProps) {
  const filtered = useMemo(
    () => filterTransactions(transactions, period, type, category, search),
    [transactions, period, type, category, search]
  )

  const grouped = useMemo(() => groupByDate(filtered), [filtered])

  const balances = useMemo(() => calculateRunningBalance(filtered), [filtered])

  const { handleDeleteTransaction, handleUpdateTransaction } = useTransactionForm()
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null)
  const [editTarget, setEditTarget] = useState<Transaction | null>(null)

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Nenhuma transação encontrada
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {transactions.length === 0
              ? 'Comece registrando sua primeira transação'
              : 'Tente ajustar os filtros'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {Array.from(grouped.entries()).map(([dateStr, dateTransactions]) => (
        <div key={dateStr}>
          {/* Date Header */}
          <div className="px-4 py-3 sm:px-6 bg-gray-50 dark:bg-gray-700">
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
              {dateStr}
            </p>
          </div>

          {/* Transactions for this date */}
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {dateTransactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                runningBalance={balances.get(transaction.id) || 0}
                onEdit={() => setEditTarget(transaction)}
                onDelete={() => setDeleteTarget(transaction)}
              />
            ))}
          </div>

          {/* Daily total */}
          <div className="px-4 py-3 sm:px-6 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
            {(() => {
              const income = dateTransactions
                .filter((tx) => tx.type === 'income')
                .reduce((sum, tx) => sum + tx.amount, 0)

              const expenses = dateTransactions
                .filter((tx) => tx.type === 'expense')
                .reduce((sum, tx) => sum + tx.amount, 0)

              const net = income - expenses

              return (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Total do Dia</span>
                  <div className="flex items-center gap-4">
                    <span className="text-green-600 dark:text-green-400 font-semibold">
                      +R$ {income.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-red-600 dark:text-red-400 font-semibold">
                      -R$ {expenses.toFixed(2).replace('.', ',')}
                    </span>
                    <span
                      className={`font-semibold ${
                        net >= 0
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      R$ {Math.abs(net).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      ))}

      {/* Overall totals */}
      <div className="px-4 py-4 sm:px-6 bg-gray-100 dark:bg-gray-700 border-t-2 border-gray-300 dark:border-gray-600">
        {(() => {
          const income = filtered
            .filter((tx) => tx.type === 'income')
            .reduce((sum, tx) => sum + tx.amount, 0)

          const expenses = filtered
            .filter((tx) => tx.type === 'expense')
            .reduce((sum, tx) => sum + tx.amount, 0)

          const net = income - expenses

          return (
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-gray-900 dark:text-white">Total</span>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Ganhos</p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    R$ {income.toFixed(2).replace('.', ',')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Despesas</p>
                  <p className="text-lg font-bold text-red-600 dark:text-red-400">
                    R$ {expenses.toFixed(2).replace('.', ',')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Líquido</p>
                  <p
                    className={`text-lg font-bold ${
                      net >= 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    R$ {Math.abs(net).toFixed(2).replace('.', ',')}
                  </p>
                </div>
              </div>
            </div>
          )
        })()}
      </div>
    </div>

    {/* Delete confirmation modal */}
    {deleteTarget && (
      <DeleteTransactionConfirm
        transaction={deleteTarget}
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async (id) => {
          await handleDeleteTransaction(id)
        }}
      />
    )}

    {/* Edit modal */}
    {editTarget && (
      <EditTransactionModal
        transaction={editTarget}
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        onSave={async (id, data) => {
          await handleUpdateTransaction(id, data)
        }}
      />
    )}
    </>
  )
}
