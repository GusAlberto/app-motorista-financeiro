/**
 * app/(app)/dashboard/page.tsx
 *
 * Main dashboard page showing financial KPIs and analytics.
 * Server Component that fetches data for the selected period.
 * Protected by middleware.ts (requires authentication).
 *
 * Hierarchy: net profit is the hero number (the answer to "did today pay
 * off?" — the app's core promise), earnings/expenses are secondary.
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
import { TrendingUp, TrendingDown, DollarSign, Plus, Receipt } from 'lucide-react'
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
          <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-slate-50">Dashboard</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            {dashboardData.period_label}
          </p>
        </div>
        <Link
          href="/transactions"
          className="btn-primary btn-sheen flex h-11 items-center gap-2 rounded-xl px-4 font-semibold shadow-md shadow-slate-900/10 transition-shadow dark:shadow-black/30"
        >
          <Plus className="h-5 w-5" aria-hidden="true" />
          <span>Nova Transação</span>
        </Link>
      </div>

      {/* Period Selector */}
      <PeriodSelector />

      {/* Hero: Net Profit — the headline number */}
      <DashboardKPICard
        label="Lucro líquido"
        value={stats.net_profit}
        icon={<DollarSign className="h-full w-full" aria-hidden="true" />}
        color={stats.net_profit >= 0 ? 'green' : 'red'}
        size="hero"
      />

      {/* Secondary: Earnings / Expenses */}
      <div className="grid gap-4 sm:grid-cols-2">
        <DashboardKPICard
          label="Ganhos"
          value={stats.total_income}
          icon={<TrendingUp className="h-full w-full" aria-hidden="true" />}
          color="green"
        />
        <DashboardKPICard
          label="Despesas"
          value={stats.total_expenses}
          icon={<TrendingDown className="h-full w-full" aria-hidden="true" />}
          color="red"
        />
      </div>

      {/* Chart */}
      {hasData ? (
        <EarningsChart data={chartData.data} />
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-700">
          <Receipt className="h-8 w-8 text-slate-400 dark:text-slate-600" aria-hidden="true" />
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Nenhuma transação registrada ainda. Comece a registrar seus ganhos e despesas!
          </p>
          <Link
            href="/transactions"
            className="mt-1 text-sm font-semibold text-slate-900 hover:underline dark:text-white"
          >
            Registrar primeira transação →
          </Link>
        </div>
      )}

      {/* Quick Stats */}
      {hasData && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Total de Transações
            </p>
            <p className="mt-2 font-display text-2xl font-bold tabular-nums text-slate-900 dark:text-slate-50">
              {stats.transaction_count}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
              {stats.income_count} ganhos, {stats.expense_count} despesas
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Ticket Médio
            </p>
            <p className="mt-2 font-display text-2xl font-bold tabular-nums text-slate-900 dark:text-slate-50">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(
                stats.transaction_count > 0
                  ? (stats.total_income + stats.total_expenses) / stats.transaction_count
                  : 0
              )}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
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
