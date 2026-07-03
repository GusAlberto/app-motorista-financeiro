/**
 * components/PeriodSelector.tsx
 *
 * Period filter selector for dashboard views — segmented control.
 * Allows switching between today, week, month, and year views.
 * Updates URL params without page reload.
 */

'use client'

import { useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import type { PeriodType } from '@/types/dashboard'

const PERIOD_OPTIONS: Array<{ value: PeriodType; label: string }> = [
  { value: 'today', label: 'Hoje' },
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mês' },
  { value: 'year', label: 'Ano' },
]

interface PeriodSelectorProps {
  onPeriodChange?: (period: PeriodType) => void
  className?: string
}

export function PeriodSelector({ onPeriodChange, className }: PeriodSelectorProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const currentPeriod = (searchParams.get('period') as PeriodType) || 'today'

  const handlePeriodChange = (period: PeriodType) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams)
      params.set('period', period)
      router.push(`?${params.toString()}`, { scroll: false })
      onPeriodChange?.(period)
    })
  }

  return (
    <div
      role="tablist"
      aria-label="Período"
      className={cn(
        'inline-flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-900',
        isPending && 'opacity-70',
        className
      )}
    >
      {PERIOD_OPTIONS.map((option) => {
        const isActive = currentPeriod === option.value
        return (
          <button
            key={option.value}
            role="tab"
            aria-selected={isActive}
            onClick={() => handlePeriodChange(option.value)}
            disabled={isPending}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-semibold transition-colors duration-150',
              isActive
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100',
              isPending && 'cursor-not-allowed'
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
