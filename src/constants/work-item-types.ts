import { BookMarked, Bug, Lightbulb, LucideIcon, Puzzle } from 'lucide-react'

export type WorkItemTypeKey = 'FEATURE' | 'BUG' | 'TASK' | 'IDEA'

interface WorkItemTypeConfig {
  icon: LucideIcon
  color: string
  label: string
}

export const WORK_ITEM_TYPES: Record<WorkItemTypeKey, WorkItemTypeConfig> = {
  FEATURE: {
    icon: Puzzle,
    color: 'text-purple-500',
    label: 'Feature'
  },
  BUG: {
    icon: Bug,
    color: 'text-red-500',
    label: 'Bug'
  },
  TASK: {
    icon: BookMarked,
    color: 'text-blue-500',
    label: 'Task'
  },
  IDEA: {
    icon: Lightbulb,
    color: 'text-yellow-500',
    label: 'Idea'
  }
} as const
