import { Skeleton } from "@/components/ui/skeleton"

export function ArtistCardSkeleton() {
  return (
    <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg overflow-hidden">
      <Skeleton className="h-48 sm:h-56 md:h-64 w-full" />
      <div className="p-4 sm:p-6 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-1/3" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function FeaturedArtistCardSkeleton() {
  return (
    <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg overflow-hidden">
      <Skeleton className="h-64 sm:h-72 md:h-80 w-full" />
      <div className="p-4 sm:p-6 space-y-4">
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-5 w-full" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        <Skeleton className="h-16 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      </div>
    </div>
  )
}
