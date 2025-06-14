export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-stone-200 dark:border-stone-700 rounded-full animate-spin"></div>
        <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-stone-800 dark:border-t-stone-100 rounded-full animate-spin"></div>
      </div>
    </div>
  )
}

export function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-stone-200 dark:bg-stone-700 h-4 rounded mb-2"></div>
      <div className="bg-stone-200 dark:bg-stone-700 h-4 rounded w-3/4 mb-2"></div>
      <div className="bg-stone-200 dark:bg-stone-700 h-4 rounded w-1/2"></div>
    </div>
  )
}
