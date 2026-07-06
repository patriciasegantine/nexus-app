import { Skeleton } from '@/components/ui/skeleton'

export function StatCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-lg border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <Skeleton className="h-7 w-12" />
          <Skeleton className="h-3 w-36" />
        </div>
      ))}
    </div>
  )
}

export function ChartCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-[200px] w-full rounded-md" />
    </div>
  )
}

export function RecentTasksSkeleton() {
  return (
    <div className="rounded-lg border bg-card">
      <div className="p-6 border-b">
        <Skeleton className="h-5 w-32" />
      </div>
      <div className="divide-y">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-6 py-3">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-5 w-20 rounded-full ml-auto" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function RecentProjectsSkeleton() {
  return (
    <div className="rounded-lg border bg-card">
      <div className="p-6 border-b">
        <Skeleton className="h-5 w-36" />
      </div>
      <div className="divide-y">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-6 py-4">
            <Skeleton className="h-8 w-8 rounded-md shrink-0" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-56" />
            </div>
            <div className="shrink-0 space-y-1.5 text-right">
              <Skeleton className="h-3 w-14 ml-auto" />
              <Skeleton className="h-3 w-16 ml-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
