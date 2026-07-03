/**
 * app/(app)/dashboard/page.tsx
 *
 * Main dashboard page showing financial KPIs and analytics.
 * Server Component that fetches data for the selected period.
 * Protected by middleware.ts (requires authentication).
 */

import { Suspense } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getDashboardData, getChartData } from '@/lib/queries/dashboard'
import { DashboardKPICard } from '@/components/DashboardKPICard'
import { PeriodSelector } from '@/components/PeriodSelector'
import { EarningsChart } from '@/components/EarningsChart'
import { DashboardErrorBoundary } from '@/components/DashboardErrorBoundary'
import { DashboardSkeleton } from '@/components/DashboardSkeleton'
import { TrendingUp, TrendingDown, DollarSign, Plus } from 'lucide-react'
import type { PeriodType } from '@/types/dashboard'

export const metadata: Metadata = {
  title: 'Dashboard | App Motorista',
  description: 'Visão geral dos seus ganhos e despesas em tempo real.',
}

interface DashboardPageProps {
  searchParams: Promise<{ period?: string }>
}

async function DashboardContent({ period }: { period: PeriodType }) {
  const [dashboardData, chartData] = await Promise.all([
    getDashboardData(period),
    getChartData(period),
  ])

  const { stats } = dashboardData
  const hasData = stats.transaction_count > 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Dashboard</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Visão geral dos seus ganhos e despesas — {dashboardData.period_label}
          </p>
        </div>
        <Link
          href="/transactions"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          <span>Nova Transação</span>
        </Link>
      </div>

      {/* Period Selector */}
      <PeriodSelector />

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <DashboardKPICard
          label="Ganhos"
          value={stats.total_income}
          icon={<TrendingUp className="h-full w-full" />}
          color="green"
        />
        <DashboardKPICard
          label="Despesas"
          value={stats.total_expenses}
          icon={<TrendingDown className="h-full w-full" />}
          color="red"
        />
        <DashboardKPICard
          label="Lucro Líquido"
          value={stats.net_profit}
          icon={<DollarSign className="h-full w-full" />}
          color={stats.net_profit >= 0 ? 'green' : 'red'}
        />
      </div>

      {/* Chart */}
      {hasData ? (
        <EarningsChart data={chartData.data} type="line" />
      ) : (
        <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Nenhuma transação registrada ainda. Comece a registrar seus ganhos e despesas!
          </p>
        </div>
      )}

      {/* Quick Stats */}
      {hasData && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900/50">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total de Transações
            </p>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-50">
              {stats.transaction_count}
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
              {stats.income_count} ganhos, {stats.expense_count} despesas
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900/50">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Ticket Médio
            </p>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-50">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(
                stats.transaction_count > 0
                  ? (stats.total_income + stats.total_expenses) / stats.transaction_count
                  : 0
              )}
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
              Média por transação
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams
  const period = (params.period as PeriodType) || 'today'

  return (
    <DashboardErrorBoundary>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent period={period} />
      </Suspense>
    </DashboardErrorBoundary>
  )
}
