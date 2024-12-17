'use client'

import { useWorkItems } from "@/hooks/work-items/use-work-items"
import { Loading } from "@/components/loading/loading"
import { useState } from "react"
import { BoardContent, BoardHeader, BoardStatusHeader } from "@/components/board";

export default function BoardPage() {
  const {data: workItems, isLoading} = useWorkItems()
  const [collapsedItems, setCollapsedItems] = useState<Set<string>>(new Set())
  
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
      <BoardHeader/>
      <BoardStatusHeader
        workItems={workItems}
        isAllCollapsed={isAllCollapsed}
        onToggleAllCollapse={toggleAllCollapse}
      />
      
      {isLoading ? (
        <Loading/>
      ) : (
        <BoardContent
          workItems={workItems}
          collapsedItems={collapsedItems}
          onToggleCollapse={toggleItemCollapse}
        />
      )}
    </div>
  )
}
