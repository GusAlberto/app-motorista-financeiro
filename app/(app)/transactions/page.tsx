import { Suspense } from 'react'
import type { Metadata } from 'next'
import { createUserServerClient } from '@/lib/supabase/server'
import { TransactionList } from '@/components/TransactionList'
import { TransactionFilters } from '@/components/TransactionFilters'
import { TransactionListSkeleton } from '@/components/TransactionListSkeleton'
import { MobileQuickForm } from './mobile-quick-form'

export const metadata: Metadata = {
  title: 'Transações | App Motorista',
  description: 'Histórico de ganhos e despesas.',
}

/**
 * Transactions page
 * Server component that displays all transactions with filtering and search.
 * Navigation (back to dashboard, settings, etc.) is handled by the shared
 * Navbar / BottomNav in app/(app)/layout.tsx — this page owns only its content.
 */
export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const period = (params.period as string) || 'month'
  const type = (params.type as string) || 'all'
  const category = (params.category as string) || ''
  const search = (params.search as string) || ''

  const supabase = await createUserServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-slate-500 dark:text-slate-400">Faça login para ver suas transações</p>
      </div>
    )
  }

  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('transaction_date', { ascending: false })

  if (error) {
    console.error('Error fetching transactions:', error)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-slate-50">Transações</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Histórico completo dos seus ganhos e despesas.
        </p>
      </div>

      {/* Quick Entry Form (Income / Expense) */}
      <MobileQuickForm />

      {/* Filters */}
      <TransactionFilters
        defaultPeriod={period}
        defaultType={type}
        defaultCategory={category}
        defaultSearch={search}
      />

      {/* Transaction List */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <Suspense fallback={<TransactionListSkeleton />}>
          <TransactionList
            transactions={transactions || []}
            period={period}
            type={type}
            category={category}
            search={search}
          />
        </Suspense>
      </div>
    </div>
  )
}
