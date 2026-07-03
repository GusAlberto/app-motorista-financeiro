/**
 * components/DashboardKPICard.tsx
 *
 * Reusable KPI card component for displaying financial metrics.
 * Shows label, amount, icon, and optional trend indicator.
 * `size="hero"` renders the larger treatment used for the day's headline
 * number (net profit) — everything else is secondary by comparison.
 * Supports dark mode.
 */

import { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

interface DashboardKPICardProps {
  label: string
  value: number
  icon?: ReactNode
  color?: 'green' | 'red' | 'blue' | 'neutral'
  size?: 'default' | 'hero'
  trend?: {
    value: number
    direction: 'up' | 'down' | 'neutral'
  }
  loading?: boolean
  className?: string
}

const COLOR_CLASSES = {
  green: {
    border: 'border-emerald-200 dark:border-emerald-900/50',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    icon: 'text-emerald-700 dark:text-emerald-400',
    value: 'text-emerald-700 dark:text-emerald-400',
  },
  red: {
    border: 'border-red-200 dark:border-red-900/50',
    bg: 'bg-red-50 dark:bg-red-950/30',
    icon: 'text-red-700 dark:text-red-400',
    value: 'text-red-700 dark:text-red-400',
  },
  blue: {
    border: 'border-amber-200 dark:border-amber-900/50',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    icon: 'text-amber-700 dark:text-amber-400',
    value: 'text-amber-700 dark:text-amber-400',
  },
  neutral: {
    border: 'border-slate-200 dark:border-slate-800',
    bg: 'bg-slate-50 dark:bg-slate-900/30',
    icon: 'text-slate-600 dark:text-slate-400',
    value: 'text-slate-900 dark:text-slate-50',
  },
} as const

const trendColorClasses = {
  up: 'text-emerald-700 dark:text-emerald-400',
  down: 'text-red-700 dark:text-red-400',
  neutral: 'text-slate-600 dark:text-slate-400',
}

const trendSymbol = {
  up: '↑',
  down: '↓',
  neutral: '→',
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value)
}

export function DashboardKPICard({
  label,
  value,
  icon,
  color = 'neutral',
  size = 'default',
  trend,
  loading = false,
  className,
}: DashboardKPICardProps) {
  const c = COLOR_CLASSES[color]
  const isHero = size === 'hero'

  return (
    <div
      className={cn(
        'rounded-2xl border p-6 transition-shadow duration-200',
        c.border,
        c.bg,
        isHero && 'p-8',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={cn('font-medium text-slate-600 dark:text-slate-400', isHero ? 'text-sm' : 'text-sm')}>
            {label}
          </p>
          {loading ? (
            <div className={cn('mt-2 animate-pulse rounded bg-slate-200 dark:bg-slate-700', isHero ? 'h-12 w-48' : 'h-8 w-32')} />
          ) : (
            <>
              <p
                className={cn(
                  'mt-2 font-display font-bold tabular-nums',
                  isHero ? 'text-4xl sm:text-5xl' : 'text-2xl sm:text-3xl',
                  isHero ? c.value : 'text-slate-900 dark:text-slate-50',
                )}
              >
                {formatCurrency(value)}
              </p>
              {trend && (
                <p
                  className={cn(
                    'mt-2 flex items-center gap-1 text-sm font-semibold',
                    trendColorClasses[trend.direction]
                  )}
                >
                  <span aria-hidden="true">{trendSymbol[trend.direction]}</span>
                  <span>{formatCurrency(Math.abs(trend.value))}</span>
                </p>
              )}
            </>
          )}
        </div>

        {icon && (
          <div className={cn('flex-shrink-0 rounded-xl bg-white/60 p-3 dark:bg-slate-900/60', isHero && 'p-3.5')}>
            <div className={cn(isHero ? 'h-7 w-7' : 'h-6 w-6', c.icon)}>{icon}</div>
          </div>
        )}
      </div>
    </div>
  )
}
