/**
 * components/DashboardSkeleton.tsx
 *
 * Loading skeleton for dashboard UI.
 * Shows placeholder blocks while data is being fetched.
 */

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
        <div className="h-5 w-96 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Period selector skeleton */}
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 w-20 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
        ))}
      </div>

      {/* KPI cards skeleton */}
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900/30"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                <div className="h-4 w-32 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
                <div className="h-8 w-40 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              </div>
              <div className="h-12 w-12 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        ))}
      </div>

      {/* Chart skeleton */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900/30">
        <div className="h-4 w-40 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
        <div className="mt-6 space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          ))}
        </div>
      </div>

      {/* Transaction list skeleton */}
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900/50"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
                <div className="h-3 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              </div>
              <div className="h-6 w-20 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
