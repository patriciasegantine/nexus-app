'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Board</h1>
          <p className="text-muted-foreground">
            Manage your tasks and projects
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4"/>
          Add Task
        </Button>
      </div>
    </div>
  )
}
