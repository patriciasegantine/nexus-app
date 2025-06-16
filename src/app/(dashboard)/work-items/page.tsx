'use client'

import { useWorkItems } from "@/hooks/work-items/use-work-items";

export default function WorkItemsPage() {
  const {data: workItems, isLoading, error} = useWorkItems()
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading work items...</p>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center text-red-500">
          <p>Error loading work items</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Work Items</h1>
      </div>
      
      <div className="grid gap-4">
        {workItems?.map((item) => (
          <div key={item.id} className="border rounded-lg p-4">
            <h3 className="font-semibold">{item.title}</h3>
            <p className="text-muted-foreground">{item.description}</p>
            <div className="flex gap-2 mt-2">
              <span className={`px-2 py-1 rounded text-xs ${
                item.status === 'DONE' ? 'bg-green-100 text-green-800' :
                  item.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
              }`}>
                {item.status}
              </span>
              <span className={`px-2 py-1 rounded text-xs ${
                item.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                  item.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
              }`}>
                {item.priority}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
