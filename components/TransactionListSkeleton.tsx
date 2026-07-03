export function TransactionListSkeleton() {
  return (
    <div className="divide-y divide-slate-200 dark:divide-slate-800">
      {[...Array(3)].map((_, dateIdx) => (
        <div key={dateIdx}>
          {/* Date header */}
          <div className="bg-slate-50 px-4 py-3 sm:px-6 dark:bg-slate-800/60">
            <div className="h-4 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          </div>

          {/* Transaction items skeleton */}
          {[...Array(2)].map((_, txIdx) => (
            <div
              key={txIdx}
              className="flex items-center justify-between gap-4 border-b border-slate-100 px-4 py-4 sm:px-6 dark:border-slate-800"
            >
              <div className="flex flex-1 items-center gap-4">
                <div className="h-2 w-2 flex-shrink-0 animate-pulse rounded-full bg-slate-300 dark:bg-slate-700" />
                <div className="flex-1">
                  <div className="mb-2 h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="h-3 w-48 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
                </div>
              </div>

              <div className="flex flex-shrink-0 items-center gap-4">
                <div className="h-4 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                <div className="hidden gap-2 sm:flex">
                  <div className="h-8 w-8 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
                  <div className="h-8 w-8 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
                </div>
              </div>
            </div>
          ))}

          {/* Daily total skeleton */}
          <div className="bg-slate-50 px-4 py-3 sm:px-6 dark:bg-slate-800/60">
            <div className="h-4 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      ))}
    </div>
  )
}
