import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export function BoardHeader() {
  return (
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
  )
}
