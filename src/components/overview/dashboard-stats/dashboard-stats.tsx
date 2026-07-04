import { CheckCircle2, ListTodo, Timer, AlertCircle } from 'lucide-react'
import { TASK_STATUS_COLORS } from '@/constants/task'
import { AppRoutes } from '@/constants/routes'
import { SummaryMetric } from '@/components/ui/summary-metric'

interface DashboardStatsProps {
  totalTasks: number
  inProgress: number
  completed: number
  overdue: number
}

export function DashboardStats({ totalTasks, inProgress, completed, overdue }: DashboardStatsProps) {
  const isEmpty = totalTasks === 0

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <SummaryMetric
        icon={ListTodo}
        label="Total Tasks"
        value={totalTasks}
        description={isEmpty ? "Start by creating your first project" : "across all projects"}
        color={TASK_STATUS_COLORS.TODO}
        href={AppRoutes.DASHBOARD.TASKS}
      />
      <SummaryMetric
        icon={Timer}
        label="In Progress"
        value={inProgress}
        description="currently active"
        color={TASK_STATUS_COLORS.IN_PROGRESS}
        href={`${AppRoutes.DASHBOARD.TASKS}?status=IN_PROGRESS`}
      />
      <SummaryMetric
        icon={CheckCircle2}
        label="Done"
        value={completed}
        description="tasks done"
        color={TASK_STATUS_COLORS.DONE}
        href={`${AppRoutes.DASHBOARD.TASKS}?status=DONE`}
      />
      <SummaryMetric
        icon={AlertCircle}
        label="Overdue"
        value={overdue}
        description="past due date"
        color="hsl(var(--destructive))"
        href={`${AppRoutes.DASHBOARD.TASKS}?dueDate=overdue`}
      />
    </div>
  )
}
