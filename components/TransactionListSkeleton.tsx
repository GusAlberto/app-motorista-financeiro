export function TransactionListSkeleton() {
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {/* Date header skeleton */}
      {[...Array(3)].map((_, dateIdx) => (
        <div key={dateIdx}>
          {/* Date header */}
          <div className="px-4 py-3 sm:px-6 bg-gray-50 dark:bg-gray-700">
            <div className="h-4 w-40 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>

          {/* Transaction items skeleton */}
          {[...Array(2)].map((_, txIdx) => (
            <div
              key={txIdx}
              className="px-4 py-4 sm:px-6 flex items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-700"
            >
              {/* Left side */}
              <div className="flex items-center gap-4 flex-1">
                <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                  <div className="h-3 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>

              {/* Right side */}
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="hidden sm:flex gap-2">
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
                </div>
              </div>
            </div>
          ))}

          {/* Daily total skeleton */}
          <div className="px-4 py-3 sm:px-6 bg-gray-50 dark:bg-gray-700">
            <div className="h-4 w-48 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  )
}
