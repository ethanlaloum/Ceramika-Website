import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <Skeleton className="h-48 sm:h-56 md:h-64 w-full" />
        <div className="p-4 sm:p-6">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-3" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function CollectionCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <Skeleton className="h-48 sm:h-56 md:h-64 w-full" />
        <div className="p-4 sm:p-6">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}

export function ArtistCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <Skeleton className="h-48 sm:h-56 md:h-64 w-full" />
        <div className="p-4 sm:p-6">
          <Skeleton className="h-6 w-2/3 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-2" />
          <Skeleton className="h-4 w-1/3 mb-3" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function HeroSkeleton() {
  return (
    <div className="h-[80vh] sm:h-[90vh] flex items-center justify-center">
      <div className="text-center max-w-4xl mx-auto px-4">
        <Skeleton className="h-16 sm:h-20 md:h-24 lg:h-28 w-full mb-6" />
        <Skeleton className="h-8 sm:h-10 w-3/4 mx-auto mb-6" />
        <Skeleton className="h-6 w-2/3 mx-auto mb-8" />
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-12 w-48" />
        </div>
      </div>
    </div>
  )
}
