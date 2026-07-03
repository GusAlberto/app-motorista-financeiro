import { Suspense } from 'react'
import Link from 'next/link'
import { createUserServerClient } from '@/lib/supabase/server'
import { TransactionList } from '@/components/TransactionList'
import { TransactionFilters } from '@/components/TransactionFilters'
import { TransactionListSkeleton } from '@/components/TransactionListSkeleton'
import { MobileQuickForm } from './mobile-quick-form'
import { ArrowLeft } from 'lucide-react'

/**
 * Transactions page
 * Server component that displays all transactions with filtering and search
 */
export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  // Get filter parameters from URL (searchParams is a Promise in Next.js 15)
  const params = await searchParams
  const period = (params.period as string) || 'month'
  const type = (params.type as string) || 'all'
  const category = (params.category as string) || ''
  const search = (params.search as string) || ''

  // Fetch user's transactions
  const supabase = await createUserServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Faça login para ver suas transações</p>
      </div>
    )
  }

  // Fetch all transactions (filtering will be done client-side for now)
  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('transaction_date', { ascending: false })

  if (error) {
    console.error('Error fetching transactions:', error)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transações</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 sm:px-6 max-w-6xl mx-auto">
        {/* Quick Entry Form (Income / Expense) */}
        <MobileQuickForm />

        {/* Filters */}
        <div className="mb-6">
          <TransactionFilters
            defaultPeriod={period}
            defaultType={type}
            defaultCategory={category}
            defaultSearch={search}
          />
        </div>

        {/* Transaction List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
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
    </div>
  )
}
