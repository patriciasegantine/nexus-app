export type TaskStatusKey = 'TODO' | 'IN_PROGRESS' | 'DONE'

export const TASK_STATUS: Record<TaskStatusKey, TaskStatusKey> = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE'
} as const

export const TASK_STATUS_NAMES: Record<TaskStatusKey, string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done'
} as const

export const TASK_STATUS_COLORS: Record<TaskStatusKey, string> = {
  TODO: 'hsl(var(--status-todo))',
  IN_PROGRESS: 'hsl(var(--status-in-progress))',
  DONE: 'hsl(var(--status-done))'
} as const

export const INITIAL_COLUMNS = [
  {id: TASK_STATUS.TODO, name: TASK_STATUS_NAMES.TODO},
  {id: TASK_STATUS.IN_PROGRESS, name: TASK_STATUS_NAMES.IN_PROGRESS},
  {id: TASK_STATUS.DONE, name: TASK_STATUS_NAMES.DONE}
] as const
