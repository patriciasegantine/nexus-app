import { getRecentTasks } from '@/lib/data/dashboard'
import { RecentTasksTable } from './recent-tasks-table'

export async function RecentTasksSection() {
  const tasks = await getRecentTasks()

  return <RecentTasksTable tasks={tasks} />
}
