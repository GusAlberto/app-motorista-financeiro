import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard | App Motorista',
}

/**
 * app/(app)/dashboard/page.tsx
 *
 * Dashboard placeholder — Phase 3 will implement the full dashboard.
 * Protected by middleware.ts (requires authentication).
 */
export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Visão geral dos seus ganhos e despesas.
        </p>
      </div>

      {/* Placeholder — Phase 3 will add KPI cards and chart */}
      <div className="rounded-2xl border border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Dashboard em construção — disponível na Fase 3.
        </p>
      </div>
    </div>
  )
}
