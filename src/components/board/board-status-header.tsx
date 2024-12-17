import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { TASK_STATUS_NAMES } from "@/constants/task"
import { WorkItem } from '@/types/work-item'

interface BoardStatusHeaderProps {
  workItems?: WorkItem[]
  isAllCollapsed: boolean
  onToggleAllCollapse: () => void
}

export function BoardStatusHeader({
                                    workItems,
                                    isAllCollapsed,
                                    onToggleAllCollapse
                                  }: BoardStatusHeaderProps) {
  return (
    <div className="grid border-b bg-muted/50" style={{gridTemplateColumns: '500px 1fr'}}>
      <div className="p-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleAllCollapse}
        >
          {isAllCollapsed ? (
            <ChevronRight className="h-4 w-4 mr-2"/>
          ) : (
            <ChevronDown className="h-4 w-4 mr-2"/>
          )}
          {isAllCollapsed ? 'Expand all' : 'Collapse all'}
        </Button>
      </div>
      
      <div className="grid grid-cols-3 gap-4 p-4">
        {Object.entries(TASK_STATUS_NAMES).map(([key, value]) => (
          <div key={key} className="text-sm font-medium flex items-center justify-between">
            <span>{value}</span>
            <span className="text-xs bg-muted px-2 py-1 rounded-full">
              {workItems?.reduce((acc, wi) =>
                acc + wi.tasks.filter(t => t.status === key).length, 0
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
