import { Task } from '@/types/task'
import { TASK_STATUS_NAMES } from '@/constants/task'
import { TaskCard } from './task-card'

interface TasksGridProps {
  tasks: Task[]
  isCollapsed: boolean
}

export function TasksGrid({tasks, isCollapsed}: TasksGridProps) {
  if (isCollapsed) {
    return (
      <div className="grid grid-cols-3 gap-4 p-4">
        {Object.keys(TASK_STATUS_NAMES).map((status) => (
          <div key={status} className="text-sm text-muted-foreground">
            {tasks.filter(t => t.status === status).length} tasks
          </div>
        ))}
      </div>
    )
  }
  
  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {Object.keys(TASK_STATUS_NAMES).map((status) => (
        <div key={status} className="space-y-2">
          {tasks
            .filter(task => task.status === status)
            .map(task => (
              <TaskCard key={task.id} task={task}/>
            ))}
        </div>
      ))}
    </div>
  )
}
