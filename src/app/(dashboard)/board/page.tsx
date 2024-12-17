'use client'

import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronRight, Plus } from 'lucide-react'
import { TASK_PRIORITIES_COLORS, TASK_PRIORITY_NAMES, TASK_STATUS_NAMES } from "@/constants/task"
import { useWorkItems } from "@/hooks/work-items/use-work-items";
import { Loading } from "@/components/loading/loading";
import { DragDropContext } from "@hello-pangea/dnd";
import { useState } from "react";
import { WORK_ITEM_TYPES } from "@/constants/work-item-types";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function BoardPage() {
  const {data: workItems, isLoading} = useWorkItems()
  const [collapsedItems, setCollapsedItems] = useState<Set<string>>(new Set())
  
  const handleDragEnd = () => {
  }
  
  const toggleItemCollapse = (itemId: string) => {
    setCollapsedItems(prev => {
      const next = new Set(prev)
      if (next.has(itemId)) {
        next.delete(itemId)
      } else {
        next.add(itemId)
      }
      return next
    })
  }
  
  const toggleAllCollapse = () => {
    if (collapsedItems.size === workItems?.length) {
      setCollapsedItems(new Set())
    } else {
      setCollapsedItems(new Set(workItems?.map(wi => wi.id)))
    }
  }
  
  const isAllCollapsed = collapsedItems.size === workItems?.length
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Board</h1>
          <p className="text-muted-foreground">
            Manage work items and tasks
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4"/>
          New Work Item
        </Button>
      </div>
      
      {/* Status Headers */}
      <div className="grid border-b bg-muted/50" style={{gridTemplateColumns: '400px 1fr'}}>
        <div className="p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleAllCollapse}
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
      
      {/*Board Content */}
      {
        isLoading ? (
          <Loading/>
        ) : (
          <div className="flex-1 overflow-auto">
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="space-y-1">
                {workItems?.map(workItem => {
                  const isCollapsed = collapsedItems.has(workItem.id)
                  
                  return (
                    <div
                      key={workItem.id}
                      className="grid border-b hover:bg-muted/50 transition-colors"
                      style={{gridTemplateColumns: '400px 1fr'}}
                    >
                      {/* Work Item Details */}
                      <div className="p-4 border-r">
                        <div className="flex gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => toggleItemCollapse(workItem.id)}
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
                                  <div className={cn("h-5 w-5", color)}>
                                    <Icon className="h-full w-full"/>
                                  </div>
                                )
                              })()}
                              <h3 className="font-medium truncate">{workItem.title}</h3>
                            </div>
                            
                            {
                              !isCollapsed && (
                                <div className="flex items-center gap-3 ">
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
                      
                      {/* Tasks Grid */}
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
                })}
              </div>
            </DragDropContext>
          </div>
        )
      }
    </div>
  )
}
