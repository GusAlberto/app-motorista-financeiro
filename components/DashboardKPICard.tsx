/**
 * components/DashboardKPICard.tsx
 *
 * Reusable KPI card component for displaying financial metrics.
 * Shows label, amount, icon, and optional trend indicator.
 * Supports dark mode.
 */

import { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

interface DashboardKPICardProps {
  label: string
  value: number
  icon?: ReactNode
  color?: 'green' | 'red' | 'blue' | 'neutral'
  trend?: {
    value: number
    direction: 'up' | 'down' | 'neutral'
  }
  loading?: boolean
  className?: string
}

export function DashboardKPICard({
  label,
  value,
  icon,
  color = 'neutral',
  trend,
  loading = false,
  className,
}: DashboardKPICardProps) {
  // Color scheme mapping
  const colorClasses = {
    green: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900/50',
    red: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50',
    blue: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50',
    neutral: 'bg-gray-50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-800/50',
  }

  const iconColorClasses = {
    green: 'text-green-600 dark:text-green-400',
    red: 'text-red-600 dark:text-red-400',
    blue: 'text-blue-600 dark:text-blue-400',
    neutral: 'text-gray-600 dark:text-gray-400',
  }

  const trendColorClasses = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400',
  }

  const trendSymbol = {
    up: '↑',
    down: '↓',
    neutral: '→',
  }

  return (
    <div
      className={cn(
        'rounded-lg border p-6 transition-all duration-200',
        colorClasses[color],
        className
      )}
    >
      <div className="flex items-start justify-between">
        {/* Left side: label and trend */}
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
          {loading ? (
            <div className="mt-2 h-8 w-32 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
          ) : (
            <>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-50">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  minimumFractionDigits: 2,
                }).format(value)}
              </p>
              {trend && (
                <p
                  className={cn(
                    'mt-2 flex items-center gap-1 text-sm font-semibold',
                    trendColorClasses[trend.direction]
                  )}
                >
                  <span>{trendSymbol[trend.direction]}</span>
                  <span>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      minimumFractionDigits: 2,
                    }).format(Math.abs(trend.value))}
                  </span>
                </p>
              )}
            </>
          )}
        </div>

        {/* Right side: icon */}
        {icon && (
          <div className={cn('rounded-full p-3', `bg-white/50 dark:bg-gray-800/50`)}>
            <div className={cn('h-6 w-6', iconColorClasses[color])}>{icon}</div>
          </div>
        )}
      </div>
    </div>
  )
}
