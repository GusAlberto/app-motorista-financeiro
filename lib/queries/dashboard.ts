/**
 * lib/queries/dashboard.ts
 *
 * Server-side database queries for dashboard data fetching.
 * Uses Supabase client with RLS-enforced user isolation.
 */

import { createUserServerClient } from '@/lib/supabase/server'
import type {
  PeriodType,
  PeriodStats,
  DashboardData,
  Transaction,
  ChartDataPoint,
  ChartDataset,
} from '@/types/dashboard'

/**
 * Get the date range for a given period (from today)
 */
function getPeriodDateRange(period: PeriodType): { start: Date; end: Date } {
  const end = new Date()
  const start = new Date()

  switch (period) {
    case 'today':
      start.setHours(0, 0, 0, 0)
      end.setHours(23, 59, 59, 999)
      break
    case 'week':
      // Start from Monday of this week
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
  }

  return { start, end }
}

/**
 * Format period to human-readable label
 */
function getPeriodLabel(period: PeriodType): string {
  const today = new Date()
  const { start } = getPeriodDateRange(period)

  switch (period) {
    case 'today':
      return `Hoje, ${today.toLocaleDateString('pt-BR', { weekday: 'short' })}`
    case 'week':
      return `Semana (${start.toLocaleDateString('pt-BR')})`
    case 'month':
      return today.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    case 'year':
      return today.getFullYear().toString()
  }
}

/**
 * Fetch transactions for a given period (Server Component)
 */
export async function getDashboardData(period: PeriodType = 'today'): Promise<DashboardData> {
  const supabase = await createUserServerClient()
  const { start, end } = getPeriodDateRange(period)

  try {
    // Fetch all transactions in the period
    const { data: transactions, error: transactionError } = await supabase
      .from('transactions')
      .select('*')
      .gte('transaction_date', start.toISOString())
      .lte('transaction_date', end.toISOString())
      .order('transaction_date', { ascending: false })

    if (transactionError) {
      console.error('Transaction fetch error:', transactionError)
      throw transactionError
    }

    // Calculate aggregated stats
    const stats: PeriodStats = {
      total_income: 0,
      total_expenses: 0,
      net_profit: 0,
      transaction_count: transactions?.length || 0,
      income_count: 0,
      expense_count: 0,
    }

    if (transactions && transactions.length > 0) {
      transactions.forEach((tx: Transaction) => {
        if (tx.type === 'income') {
          stats.total_income += tx.amount
          stats.income_count += 1
        } else if (tx.type === 'expense') {
          stats.total_expenses += tx.amount
          stats.expense_count += 1
        }
      })
    }

    stats.net_profit = stats.total_income - stats.total_expenses

    return {
      period,
      stats,
      transactions: transactions || [],
      period_label: getPeriodLabel(period),
    }
  } catch (error) {
    console.error('Dashboard data fetch failed:', error)
    // Return empty dashboard on error (handled by error boundary)
    return {
      period,
      stats: {
        total_income: 0,
        total_expenses: 0,
        net_profit: 0,
        transaction_count: 0,
        income_count: 0,
        expense_count: 0,
      },
      transactions: [],
      period_label: getPeriodLabel(period),
    }
  }
}

/**
 * Fetch chart data (earnings vs expenses by day/week)
 */
export async function getChartData(period: PeriodType = 'today'): Promise<ChartDataset> {
  const supabase = await createUserServerClient()
  const { start, end } = getPeriodDateRange(period)

  try {
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('type, amount, transaction_date')
      .gte('transaction_date', start.toISOString())
      .lte('transaction_date', end.toISOString())
      .order('transaction_date', { ascending: true })

    if (error) throw error

    // Group transactions by date
    const dataByDate: Record<string, ChartDataPoint> = {}

    if (transactions) {
      transactions.forEach((tx) => {
        const dateStr = new Date(tx.transaction_date).toLocaleDateString('pt-BR')

        if (!dataByDate[dateStr]) {
          dataByDate[dateStr] = {
            date: dateStr,
            income: 0,
            expenses: 0,
            net: 0,
          }
        }

        if (tx.type === 'income') {
          dataByDate[dateStr].income += tx.amount
        } else {
          dataByDate[dateStr].expenses += tx.amount
        }

        dataByDate[dateStr].net = dataByDate[dateStr].income - dataByDate[dateStr].expenses
      })
    }

    const data = Object.values(dataByDate)

    return {
      period,
      data,
    }
  } catch (error) {
    console.error('Chart data fetch failed:', error)
    return {
      period,
      data: [],
    }
  }
}
