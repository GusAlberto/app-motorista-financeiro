/**
 * components/EarningsChart.tsx
 *
 * Earnings vs expenses chart using Recharts.
 * Displays trend data over selected period as a smooth gradient-filled
 * area chart. Supports dark mode.
 */

'use client'

import { useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { useTheme } from '@/components/ThemeProvider'
import type { ChartDataPoint } from '@/types/dashboard'
import { cn } from '@/lib/utils/cn'

interface EarningsChartProps {
  data: ChartDataPoint[]
  height?: number
  loading?: boolean
  className?: string
}

/**
 * Custom tooltip for chart
 */
function ChartTooltip({ active, payload }: any) {
  if (!active || !payload) return null

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-800">
      <p className="mb-1 font-display text-sm font-semibold text-slate-900 dark:text-slate-100">
        {payload[0]?.payload.date}
      </p>
      {payload.map((entry: any, index: number) => (
        <p key={index} style={{ color: entry.color }} className="text-sm font-medium tabular-nums">
          {entry.name}:{' '}
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(entry.value)}
        </p>
      ))}
    </div>
  )
}

export function EarningsChart({
  data,
  height = 300,
  loading = false,
  className,
}: EarningsChartProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  // Chart colors — matched to the app's emerald (income) / red (expense) semantics
  const colors = useMemo(
    () => ({
      income: isDark ? '#34d399' : '#059669',
      expenses: isDark ? '#f87171' : '#dc2626',
      gridColor: isDark ? '#1e293b' : '#e2e8f0',
      textColor: isDark ? '#64748b' : '#94a3b8',
    }),
    [isDark]
  )

  if (loading) {
    return (
      <div
        className={cn(
          'rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900',
          className
        )}
        style={{ height: height + 100 }}
      >
        <div className="h-full animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-center dark:border-slate-700 dark:bg-slate-900/50',
          className
        )}
        style={{ height }}
      >
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Nenhum dado disponível para este período
        </p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900',
        className
      )}
    >
      <h3 className="mb-4 font-display text-lg font-bold text-slate-900 dark:text-slate-50">
        Ganhos vs Despesas
      </h3>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.income} stopOpacity={0.3} />
              <stop offset="95%" stopColor={colors.income} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.expenses} stopOpacity={0.3} />
              <stop offset="95%" stopColor={colors.expenses} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={colors.gridColor} strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            stroke={colors.textColor}
            style={{ fontSize: '12px', fontFamily: 'var(--font-sans)' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke={colors.textColor}
            style={{ fontSize: '12px', fontFamily: 'var(--font-sans)' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) =>
              new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                notation: 'compact',
              }).format(value)
            }
          />
          <Tooltip content={<ChartTooltip />} />
          <Legend wrapperStyle={{ color: colors.textColor, fontSize: '13px' }} />
          <Area
            type="monotone"
            dataKey="income"
            name="Ganhos"
            stroke={colors.income}
            strokeWidth={2}
            fill="url(#incomeGradient)"
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="expenses"
            name="Despesas"
            stroke={colors.expenses}
            strokeWidth={2}
            fill="url(#expenseGradient)"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
