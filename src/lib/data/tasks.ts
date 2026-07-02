import { auth } from "@/auth"
import { DEFAULT_TASK_PAGE_SIZE } from "@/constants/preferences"
import { db } from "@/lib/db"
import type { TaskStatus, TaskPriority, TaskListItem } from "@/types/task"

export const TASKS_PER_PAGE = DEFAULT_TASK_PAGE_SIZE

export type DueDateFilter = 'overdue' | 'today' | 'this_week' | 'no_due_date'

export type TaskSortOption = "updatedAt" | "dueDate" | "title"

export interface GetTasksFilters {
  status?: TaskStatus
  priority?: TaskPriority
  search?: string
  projectId?: string
  dueDate?: DueDateFilter
  dueDateExact?: string
  tag?: string
  sort?: TaskSortOption
  page?: number
  perPage?: number
}

function buildDueDateWhere(dueDate: DueDateFilter) {
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const endOfDay = new Date(startOfDay.getTime() + 86400000)
  const endOfWeek = new Date(startOfDay.getTime() + 7 * 86400000)

  switch (dueDate) {
    case 'overdue':
      return { dueDate: { lt: now }, status: { not: 'DONE' as TaskStatus } }
    case 'today':
      return { dueDate: { gte: startOfDay, lt: endOfDay } }
    case 'this_week':
      return { dueDate: { gte: startOfDay, lt: endOfWeek } }
    case 'no_due_date':
      return { dueDate: null }
  }
}

function buildExactDueDateWhere(dueDate: string) {
  const startOfDay = new Date(`${dueDate}T00:00:00.000Z`)
  const endOfDay = new Date(startOfDay.getTime() + 86400000)
  return { dueDate: { gte: startOfDay, lt: endOfDay } }
}

export async function getTasks(filters?: GetTasksFilters): Promise<{ tasks: TaskListItem[], total: number }> {
  const session = await auth()
  if (!session?.user?.id) return { tasks: [], total: 0 }

  const page = filters?.page ?? 1
  const perPage = filters?.perPage ?? TASKS_PER_PAGE
  const skip = (page - 1) * perPage

  const where = {
    userId: session.user.id,
    ...(filters?.status && { status: filters.status }),
    ...(filters?.priority && { priority: filters.priority }),
    ...(filters?.search && { title: { contains: filters.search, mode: 'insensitive' as const } }),
    ...(filters?.projectId && { projectId: filters.projectId }),
    ...(filters?.dueDate && buildDueDateWhere(filters.dueDate)),
    ...(filters?.dueDateExact && buildExactDueDateWhere(filters.dueDateExact)),
    ...(filters?.tag && { tags: { has: filters.tag } }),
  }

  const sort = filters?.sort
  const orderBy =
    sort === "dueDate"
      ? [{ dueDate: "asc" as const }, { updatedAt: "desc" as const }]
      : sort === "title"
      ? { title: "asc" as const }
      : { updatedAt: "desc" as const }

  const [tasks, total] = await db.$transaction([
    db.task.findMany({
      where,
      orderBy,
      include: { project: { select: { id: true, name: true, slug: true } } },
      skip,
      take: perPage,
    }),
    db.task.count({ where }),
  ])

  return { tasks, total }
}

export interface TaskStats {
  total: number
  inProgress: number
  completed: number
  overdue: number
}

export async function getTaskStats(): Promise<TaskStats> {
  const session = await auth()
  if (!session?.user?.id) return { total: 0, inProgress: 0, completed: 0, overdue: 0 }

  const userId = session.user.id
  const now = new Date()

  const [byStatus, overdue] = await Promise.all([
    db.task.groupBy({
      by: ["status"],
      where: { userId },
      _count: { _all: true },
    }),
    db.task.count({
      where: { userId, dueDate: { lt: now }, status: { not: "DONE" } },
    }),
  ])

  const statusCounts = Object.fromEntries(byStatus.map((s) => [s.status, s._count._all]))
  const total = byStatus.reduce((sum, s) => sum + s._count._all, 0)

  return {
    total,
    inProgress: statusCounts["IN_PROGRESS"] ?? 0,
    completed: statusCounts["DONE"] ?? 0,
    overdue,
  }
}

export async function getTaskTags(): Promise<string[]> {
  const session = await auth()
  if (!session?.user?.id) return []

  const tasks = await db.task.findMany({
    where: { userId: session.user.id },
    select: { tags: true },
  })

  return Array.from(new Set(tasks.flatMap((task) => task.tags))).sort((a, b) =>
    a.localeCompare(b),
  )
}

export async function getTasksByProject(projectId: string) {
  const session = await auth()
  if (!session?.user?.id) return []

  return db.task.findMany({
    where: { projectId, userId: session.user.id },
    orderBy: { createdAt: "desc" },
  })
}
