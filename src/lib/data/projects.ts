import { auth } from "@/auth"
import { db } from "@/lib/db"
import type { ProjectBoardItem, Project } from "@/types/project"

const projectSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  color: true,
  tags: true,
  status: true,
  priority: true,
  startDate: true,
  targetDate: true,
  icon: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
} as const

export async function getProjects(): Promise<Project[]> {
  const session = await auth()
  if (!session?.user?.id) return []

  return db.project.findMany({
    where: { userId: session.user.id },
    select: projectSelect,
    orderBy: { createdAt: "desc" },
  })
}

export async function getProject(slug: string) {
  const session = await auth()
  if (!session?.user?.id) return null

  return db.project.findFirst({
    where: { slug, userId: session.user.id },
    select: {
      ...projectSelect,
      tasks: {
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          priority: true,
          tags: true,
          dueDate: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  })
}

export async function getProjectTags(): Promise<string[]> {
  const session = await auth()
  if (!session?.user?.id) return []

  const projects = await db.project.findMany({
    where: { userId: session.user.id },
    select: { tags: true },
  })

  const all = projects.flatMap((p) => p.tags)
  return [...new Set(all)].sort()
}

export interface GetBoardDataParams {
  search?: string
  tag?: string
  sort?: "createdAt" | "name" | "progress"
  status?: string
}

export async function getBoardData(params: GetBoardDataParams = {}): Promise<ProjectBoardItem[]> {
  const session = await auth()
  if (!session?.user?.id) return []

  const { search, tag, sort = "createdAt", status } = params

  const projects = await db.project.findMany({
    where: {
      userId: session.user.id,
      ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
      ...(tag ? { tags: { has: tag } } : {}),
      ...(status ? { status: status as never } : {}),
    },
    orderBy: sort === "name" ? { name: "asc" } : { createdAt: "desc" },
    select: {
      ...projectSelect,
      tasks: { select: { status: true, priority: true, dueDate: true } },
    },
  })

  const mapped = projects.map((project) => {
    const total = project.tasks.length
    const done = project.tasks.filter((t) => t.status === "DONE").length
    const inProgress = project.tasks.filter((t) => t.status === "IN_PROGRESS").length
    const todo = project.tasks.filter((t) => t.status === "TODO").length
    const progress = total > 0 ? Math.round((done / total) * 100) : 0
    const overdue = project.tasks.filter(
      (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "DONE"
    ).length

    return {
      id: project.id,
      name: project.name,
      slug: project.slug,
      description: project.description,
      color: project.color,
      tags: project.tags,
      status: project.status,
      priority: project.priority,
      startDate: project.startDate,
      targetDate: project.targetDate,
      icon: project.icon,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      total,
      done,
      inProgress,
      todo,
      progress,
      overdue,
    }
  })

  return sort === "progress"
    ? mapped.sort((a, b) => b.progress - a.progress)
    : mapped
}
