/**
 * components/EarningsChart.tsx
 *
 * Earnings vs expenses chart using Recharts.
 * Displays trend data over selected period.
 * Supports dark mode.
 */

'use client'

import { useMemo } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
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
  type?: 'line' | 'bar'
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
    <div className="rounded-lg border border-gray-300 bg-white p-3 shadow-lg dark:border-gray-600 dark:bg-gray-800">
      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{payload[0]?.payload.date}</p>
      {payload.map((entry: any, index: number) => (
        <p key={index} style={{ color: entry.color }} className="text-sm">
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
  type = 'line',
  height = 300,
  loading = false,
  className,
}: EarningsChartProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  // Chart colors
  const colors = useMemo(
    () => ({
      income: isDark ? '#10b981' : '#059669',
      expenses: isDark ? '#ef4444' : '#dc2626',
      gridColor: isDark ? '#374151' : '#e5e7eb',
      textColor: isDark ? '#9ca3af' : '#6b7280',
    }),
    [isDark]
  )

  if (loading) {
    return (
      <div
        className={cn(
          'rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900/30',
          className
        )}
        style={{ height: height + 100 }}
      >
        <div className="h-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div
        className={cn(
          'rounded-lg border border-gray-200 bg-gray-50 p-6 text-center dark:border-gray-800 dark:bg-gray-900/30',
          className
        )}
        style={{ height }}
      >
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Nenhum dado disponível para este período
        </p>
      </div>
    )
  }

  const ChartComponent = type === 'line' ? LineChart : BarChart
  const DataComponent = type === 'line' ? Line : Bar

  return (
    <div
      className={cn(
        'rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/50 p-6',
        className
      )}
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-4">
        Ganhos vs Despesas
      </h3>
      <ResponsiveContainer width="100%" height={height}>
        <ChartComponent
          data={data}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid stroke={colors.gridColor} strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            stroke={colors.textColor}
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke={colors.textColor}
            style={{ fontSize: '12px' }}
            tickFormatter={(value) =>
              new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                notation: 'compact',
              }).format(value)
            }
          />
          <Tooltip content={<ChartTooltip />} />
          <Legend
            wrapperStyle={{
              color: colors.textColor,
            }}
          />
          <DataComponent
            dataKey="income"
            stroke={colors.income}
            fill={colors.income}
            name="Ganhos"
            isAnimationActive={false}
          />
          <DataComponent
            dataKey="expenses"
            stroke={colors.expenses}
            fill={colors.expenses}
            name="Despesas"
            isAnimationActive={false}
          />
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  )
}
