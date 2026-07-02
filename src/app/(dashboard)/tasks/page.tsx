import { getTasks, getTaskStats, getTaskTags } from "@/lib/data/tasks"
import { getProjects } from "@/lib/data/projects"
import { TasksPageClient } from "@/components/tasks/tasks-page-client"
import type { TaskStatus, TaskPriority } from "@/types/task"
import type { DueDateFilter, TaskSortOption } from "@/lib/data/tasks"
import { DEFAULT_TASK_PAGE_SIZE, isTaskPageSizeOption } from "@/constants/preferences"
import { getStringParam, getValidatedParam } from "@/lib/search-params"
import { PageHeader } from "@/components/ui/page-header"
import { NewTaskButton } from "@/components/tasks/task-card/new-task-button"

const VALID_STATUSES = new Set<TaskStatus>(['TODO', 'IN_PROGRESS', 'DONE'])
const VALID_PRIORITIES = new Set<TaskPriority>(['LOW', 'MEDIUM', 'HIGH'])
const VALID_DUE_DATES = new Set<DueDateFilter>(['overdue', 'today', 'this_week', 'no_due_date'])
const VALID_SORTS = new Set<TaskSortOption>(['updatedAt', 'dueDate', 'title'])

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

  const status = getValidatedParam(params, 'status', VALID_STATUSES)
  const priority = getValidatedParam(params, 'priority', VALID_PRIORITIES)
  const search = getStringParam(params, 'search')
  const projectId = getStringParam(params, 'projectId')
  const tag = getStringParam(params, 'tag')
  const sort = getValidatedParam(params, 'sort', VALID_SORTS)
  const page = Math.max(1, parseInt(getStringParam(params, 'page') ?? '1') || 1)
  const rawPageSize = Number(getStringParam(params, 'pageSize') ?? DEFAULT_TASK_PAGE_SIZE)
  const perPage = isTaskPageSizeOption(rawPageSize) ? rawPageSize : DEFAULT_TASK_PAGE_SIZE

  const rawDueDateExact = getStringParam(params, 'dueDateExact')
  const dueDateExact = isValidExactDate(rawDueDateExact) ? rawDueDateExact : undefined
  const dueDate = !dueDateExact ? getValidatedParam(params, 'dueDate', VALID_DUE_DATES) : undefined

  const hasFilters = Boolean(status || priority || search || projectId || dueDate || dueDateExact || tag)

  const [{ tasks, total }, stats, projects, tags] = await Promise.all([
    getTasks({ status, priority, search, projectId, dueDate, dueDateExact, tag, sort, page, perPage }),
    getTaskStats(),
    getProjects(),
    getTaskTags(),
  ])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks"
        description="All your tasks across projects"
        action={<NewTaskButton iconOnlyOnMobile />}
      />

    <TasksPageClient
      tasks={tasks}
      total={total}
      stats={stats}
      projects={projects}
      tags={tags}
      page={page}
      perPage={perPage}
      hasFilters={hasFilters}
    />
    </div>
  )
}
