import { getTaskStatusSummary } from '@/lib/data/dashboard'
import { DashboardStats } from './dashboard-stats'

export async function DashboardStatsSection() {
  const summary = await getTaskStatusSummary()

  return (
    <DashboardStats
      totalTasks={summary?.totalTasks ?? 0}
      inProgress={summary?.inProgress ?? 0}
      completed={summary?.completed ?? 0}
      overdue={summary?.overdue ?? 0}
    />
  )
}
