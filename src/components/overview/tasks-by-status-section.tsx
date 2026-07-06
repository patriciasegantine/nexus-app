import { getTaskStatusSummary } from '@/lib/data/dashboard'
import { TasksByStatus } from './tasks-by-status'

export async function TasksByStatusSection() {
  const summary = await getTaskStatusSummary()

  return <TasksByStatus byStatus={summary?.byStatus ?? {}} />
}
