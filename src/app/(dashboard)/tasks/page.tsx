import { getTasks, getTaskTags, TASKS_PER_PAGE } from "@/lib/data/tasks"
import { getProjects } from "@/lib/data/projects"
import { TasksPageClient } from "@/components/tasks/tasks-page-client"
import type { TaskStatus, TaskPriority } from "@/types/task"
import type { DueDateFilter } from "@/lib/data/tasks"

const VALID_STATUSES = new Set<TaskStatus>(['TODO', 'IN_PROGRESS', 'DONE'])
const VALID_PRIORITIES = new Set<TaskPriority>(['LOW', 'MEDIUM', 'HIGH'])
const VALID_DUE_DATES = new Set<DueDateFilter>(['overdue', 'today', 'this_week', 'no_due_date'])

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

function isValidExactDate(value?: string) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split("-").map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day
}

export default async function TasksPage({ searchParams }: PageProps) {
  const params = await searchParams

  const rawStatus = typeof params.status === 'string' ? params.status : undefined
  const rawPriority = typeof params.priority === 'string' ? params.priority : undefined
  const rawDueDate = typeof params.dueDate === 'string' ? params.dueDate : undefined
  const rawDueDateExact = typeof params.dueDateExact === 'string' ? params.dueDateExact : undefined
  const search = typeof params.search === 'string' && params.search ? params.search : undefined
  const projectId = typeof params.projectId === 'string' && params.projectId ? params.projectId : undefined
  const tag = typeof params.tag === 'string' && params.tag ? params.tag : undefined
  const page = Math.max(1, parseInt(typeof params.page === 'string' ? params.page : '1') || 1)

  const status = rawStatus && VALID_STATUSES.has(rawStatus as TaskStatus) ? (rawStatus as TaskStatus) : undefined
  const priority = rawPriority && VALID_PRIORITIES.has(rawPriority as TaskPriority) ? (rawPriority as TaskPriority) : undefined
  const dueDateExact = isValidExactDate(rawDueDateExact)
    ? rawDueDateExact
    : undefined
  const dueDate = !dueDateExact && rawDueDate && VALID_DUE_DATES.has(rawDueDate as DueDateFilter)
    ? (rawDueDate as DueDateFilter)
    : undefined

  const hasFilters = Boolean(status || priority || search || projectId || dueDate || dueDateExact || tag)

  const [{ tasks, total }, projects, tags] = await Promise.all([
    getTasks({ status, priority, search, projectId, dueDate, dueDateExact, tag, page }),
    getProjects(),
    getTaskTags(),
  ])

  return (
    <TasksPageClient
      tasks={tasks}
      total={total}
      projects={projects}
      tags={tags}
      page={page}
      perPage={TASKS_PER_PAGE}
      hasFilters={hasFilters}
    />
  )
}
