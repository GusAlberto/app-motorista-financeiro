/**
 * components/PeriodSelector.tsx
 *
 * Period filter selector for dashboard views.
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
    <div className={cn('flex gap-2', className)}>
      {PERIOD_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => handlePeriodChange(option.value)}
          disabled={isPending}
          className={cn(
            'rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200',
            currentPeriod === option.value
              ? 'bg-blue-600 text-white dark:bg-blue-500'
              : 'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
            isPending && 'opacity-50 cursor-not-allowed'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
