import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import {
  TASK_STATUS_NAMES,
  TASK_STATUS_COLORS,
  TASK_PRIORITY_NAMES,
  TASK_PRIORITIES_COLORS,
} from '@/constants/task'
import type { RecentTask } from '@/types/task'

export const columns: ColumnDef<RecentTask>[] = [
  {
    accessorKey: 'title',
    header: 'Task',
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue('title')}</span>
    ),
  },
  {
    accessorKey: 'project',
    header: 'Project',
    cell: ({ row }) => {
      const project = row.getValue('project') as RecentTask['project']
      return (
        <span className="text-muted-foreground text-sm">
          {project?.name ?? '—'}
        </span>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as RecentTask['status']
      return (
        <Badge variant="secondary" style={{ color: TASK_STATUS_COLORS[status] }}>
          {TASK_STATUS_NAMES[status]}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'priority',
    header: 'Priority',
    cell: ({ row }) => {
      const priority = row.getValue('priority') as keyof typeof TASK_PRIORITY_NAMES
      if (!priority) return <span className="text-muted-foreground text-sm">—</span>
      return (
        <div className="flex items-center gap-1.5">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: TASK_PRIORITIES_COLORS[priority] }}
          />
          <span className="text-sm">{TASK_PRIORITY_NAMES[priority]}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated',
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {formatDistanceToNow(new Date(row.getValue('updatedAt')), { addSuffix: true })}
      </span>
    ),
  },
]
