/**
 * components/DashboardSkeleton.tsx
 *
 * Loading skeleton for dashboard UI.
 * Mirrors the hero + secondary KPI hierarchy so there's no layout shift
 * once real data arrives.
 */

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-40 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="h-5 w-56 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800/60" />
        </div>
        <div className="h-11 w-40 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
      </div>

      {/* Period selector skeleton */}
      <div className="h-11 w-72 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-900" />

      {/* Hero card skeleton */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-900/30">
        <div className="h-4 w-28 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <div className="mt-3 h-12 w-56 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
      </div>

      {/* Secondary KPI cards skeleton */}
      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/30"
          >
            <div className="h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <div className="mt-3 h-8 w-32 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
          </div>
        ))}
      </div>

      {/* Chart skeleton */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="h-5 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <div className="mt-6 h-[300px] w-full animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
      </div>

      {/* Quick stats skeleton */}
      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <div className="mt-2 h-7 w-24 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
          </div>
        ))}
      </div>
    </div>
  )
}
