import { WorkItem } from '@/types/work-item'
import { WorkItemComponent } from './work-item'
import { TasksGrid } from './tasks-grid'

interface BoardContentProps {
  workItems?: WorkItem[]
  collapsedItems: Set<string>
  onToggleCollapse: (itemId: string) => void
}

export function BoardContent({
                               workItems,
                               collapsedItems,
                               onToggleCollapse
                             }: BoardContentProps) {
  return (
    <div className="flex-1 overflow-auto">
      <div className="space-y-1">
        {workItems?.map(workItem => {
          const isCollapsed = collapsedItems.has(workItem.id)
          
          return (
            <div
              key={workItem.id}
              className="grid border-b hover:bg-muted/50 transition-colors"
              style={{gridTemplateColumns: '500px 1fr'}}
            >
              <WorkItemComponent
                workItem={workItem}
                isCollapsed={isCollapsed}
                onToggleCollapse={() => onToggleCollapse(workItem.id)}
              />
              <TasksGrid
                tasks={workItem.tasks}
                isCollapsed={isCollapsed}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
