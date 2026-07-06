import { Suspense } from "react"
import { DashboardStatsSection } from '@/components/overview/dashboard-stats/dashboard-stats-section'
import { TasksByStatusSection } from '@/components/overview/tasks-by-status-section'
import { PriorityDistributionSection } from '@/components/overview/priority-distribution-section'
import { RecentTasksSection } from '@/components/overview/recent-tasks/recent-tasks-section'
import { RecentProjectsSection } from '@/components/overview/recent-projects-section'
import {
  StatCardsSkeleton,
  ChartCardSkeleton,
  RecentTasksSkeleton,
  RecentProjectsSkeleton,
} from '@/components/overview/skeletons'
import { PageHeader } from '@/components/ui/page-header'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Overview"
        description="A summary of your progress and activities"
      />

      <Suspense fallback={<StatCardsSkeleton />}>
        <DashboardStatsSection />
      </Suspense>

      <div className="grid gap-6 md:grid-cols-2">
        <Suspense fallback={<ChartCardSkeleton />}>
          <TasksByStatusSection />
        </Suspense>
        <Suspense fallback={<ChartCardSkeleton />}>
          <PriorityDistributionSection />
        </Suspense>
      </div>

      <Suspense fallback={<RecentTasksSkeleton />}>
        <RecentTasksSection />
      </Suspense>

      <Suspense fallback={<RecentProjectsSkeleton />}>
        <RecentProjectsSection />
      </Suspense>
    </div>
  )
}
