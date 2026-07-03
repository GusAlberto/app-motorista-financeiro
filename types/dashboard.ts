/**
 * types/dashboard.ts
 *
 * Type definitions for dashboard data and UI components.
 * Includes transaction stats, period filters, and KPI data structures.
 */

/**
 * Supported period filters for dashboard views
 */
export type PeriodType = 'today' | 'week' | 'month' | 'year'

/**
 * Single transaction record
 */
export interface Transaction {
  id: string
  user_id: string
  type: 'income' | 'expense'
  category: string
  amount: number
  description: string | null
  transaction_date: string
  created_at: string
  updated_at: string
}

/**
 * Aggregated statistics for a given period
 */
export interface PeriodStats {
  total_income: number
  total_expenses: number
  net_profit: number
  transaction_count: number
  income_count: number
  expense_count: number
}

/**
 * Complete dashboard data for a selected period
 */
export interface DashboardData {
  period: PeriodType
  stats: PeriodStats
  transactions: Transaction[]
  period_label: string
}

/**
 * KPI card data (for individual display)
 */
export interface KPICardData {
  label: string
  value: number
  icon?: string
  trend?: {
    value: number
    direction: 'up' | 'down' | 'neutral'
  }
  color?: 'green' | 'red' | 'blue' | 'neutral'
}

/**
 * Chart data point for earnings vs expenses trend
 */
export interface ChartDataPoint {
  date: string
  income: number
  expenses: number
  net: number
}

/**
 * Complete chart dataset
 */
export interface ChartDataset {
  period: PeriodType
  data: ChartDataPoint[]
}
