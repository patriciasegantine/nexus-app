import { TaskPriority, TaskStatus } from "@/types/task"

export const TASK_STATUS_COLUMNS: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'] as const

export const TASK_STATUS_NAMES: Record<TaskStatus, string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done'
} as const

export const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  TODO: '#64748B',
  IN_PROGRESS: '#4C7DFF',
  DONE: '#36C275',
} as const

export const TASK_PRIORITY_NAMES: Record<TaskPriority, string> = {
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low'
} as const

export const TASK_PRIORITIES_COLORS: Record<TaskPriority, string> = {
  HIGH: '#EF4444',   // red-500
  MEDIUM: '#EAB308', // yellow-500
  LOW: '#22C55E',    // green-500
} as const

export const TASK_PRIORITY_BADGE_STYLES: Record<TaskPriority, string> = {
  LOW: `bg-[${TASK_PRIORITIES_COLORS.LOW}]/14 text-foreground`,
  MEDIUM: `bg-[${TASK_PRIORITIES_COLORS.MEDIUM}]/16 text-foreground`,
  HIGH: `bg-[${TASK_PRIORITIES_COLORS.HIGH}]/16 text-foreground`,
} as const

export const TASK_STATUS_PILL_STYLES: Record<TaskStatus, string> = {
  TODO: 'bg-slate-100 text-slate-600 dark:bg-slate-500/15 dark:text-slate-300',
  IN_PROGRESS: 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
  DONE: 'bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-300',
} as const
