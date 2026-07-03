/**
 * components/DashboardErrorBoundary.tsx
 *
 * Error boundary for dashboard components.
 * Catches query errors and displays user-friendly error messages.
 */

'use client'

import { ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface DashboardErrorBoundaryProps {
  children: ReactNode
  error?: Error | null
  reset?: () => void
  className?: string
}

export function DashboardErrorBoundary({
  children,
  error,
  reset,
  className,
}: DashboardErrorBoundaryProps) {
  if (error) {
    return (
      <div
        className={cn(
          'rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-950/30',
          className
        )}
      >
        <div className="flex items-start gap-4">
          <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-red-900 dark:text-red-100">
              Erro ao carregar o dashboard
            </h3>
            <p className="mt-1 text-sm text-red-800 dark:text-red-200">
              Não foi possível carregar os dados financeiros. Por favor, tente novamente.
            </p>
            {process.env.NODE_ENV === 'development' && (
              <p className="mt-2 font-mono text-xs text-red-700 dark:text-red-300">
                {error.message}
              </p>
            )}
            {reset && (
              <button
                onClick={reset}
                className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
              >
                Tentar novamente
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return children
}
