import { Task } from '@/types/task'

interface TasksGridProps {
  tasks: Task[]
  isCollapsed: boolean
}

export function TasksGrid({isCollapsed}: TasksGridProps) {
  
  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {
        isCollapsed ? (
          <div className="grid grid-cols-3 gap-4 p-4">
            Summary Tasks
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 p-4">
            Tasks Grid
          </div>
        )}
    </div>
  )
}
