import { TaskPriority, TaskStatus } from "@/types/task"
import { STATUS_COLORS, PRIORITY_COLORS } from "@/constants/colors"

export const TASK_STATUS_COLUMNS: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'] as const

export const TASK_STATUS_NAMES: Record<TaskStatus, string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done'
} as const

export const TASK_STATUS_COLORS: Record<TaskStatus, string> = STATUS_COLORS

export const TASK_PRIORITIES_COLORS: Record<TaskPriority, string> = PRIORITY_COLORS

export const TASK_PRIORITY_NAMES: Record<TaskPriority, string> = {
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low'
} as const
