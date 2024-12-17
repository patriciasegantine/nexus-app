import { WorkItem } from '@/types/work-item'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { WORK_ITEM_TYPES } from '@/constants/work-item-types'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { TASK_PRIORITIES_COLORS, TASK_PRIORITY_NAMES } from '@/constants/task'

interface WorkItemProps {
  workItem: WorkItem
  isCollapsed: boolean
  onToggleCollapse: () => void
}

export function WorkItemComponent({workItem, isCollapsed, onToggleCollapse}: WorkItemProps) {
  return (
    <div className="p-4 border-r">
      <div className="flex gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={onToggleCollapse}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4"/>
          ) : (
            <ChevronDown className="h-4 w-4"/>
          )}
        </Button>
        
        <div>
          <div className="flex items-center gap-3">
            <span>#{workItem.id}</span>
            {(() => {
              const {icon: Icon, color} = WORK_ITEM_TYPES[workItem.type]
              return (
                <div className="h-5 w-5">
                  <Icon className={cn("h-full w-full", color)}/>
                </div>
              )
            })()}
            <h3 className="font-medium truncate">{workItem.title}</h3>
          </div>
          
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 mt-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={workItem.assignee?.avatar}/>
                  <AvatarFallback>
                    {workItem.assignee?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{workItem.assignee?.name}</span>
              </div>
              
              <Badge
                className="text-xs text-[hsl(var(--neutral-white))] ml-auto"
                style={{backgroundColor: TASK_PRIORITIES_COLORS[workItem.priority]}}>
                <span>{TASK_PRIORITY_NAMES[workItem.priority]}</span>
              </Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
