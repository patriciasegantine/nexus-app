import type { TaskSortOption } from "@/lib/data/tasks"

export const TASK_SORT_PREFERENCE_KEY = "nexus:tasks:default-sort"
export const TASK_PAGE_SIZE_PREFERENCE_KEY = "nexus:tasks:page-size"

export const DEFAULT_TASK_SORT: TaskSortOption = "updatedAt"
export const DEFAULT_TASK_PAGE_SIZE = 12

export const TASK_SORT_OPTIONS = [
  { value: "updatedAt", label: "Recently updated" },
  { value: "dueDate", label: "Due date" },
  { value: "title", label: "Title" },
] as const satisfies ReadonlyArray<{ value: TaskSortOption; label: string }>

export const TASK_PAGE_SIZE_OPTIONS = [12, 24, 48] as const

export type TaskPageSizeOption = (typeof TASK_PAGE_SIZE_OPTIONS)[number]

export function isTaskPageSizeOption(value: number): value is TaskPageSizeOption {
  return TASK_PAGE_SIZE_OPTIONS.includes(value as TaskPageSizeOption)
}
