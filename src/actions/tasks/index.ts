"use server"

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { createTaskSchema, updateTaskSchema, updateTaskStatusSchema } from "@/validations/task"
import { revalidatePath } from "next/cache"
import { AppRoutes } from "@/constants/routes"
import { MAX_TAG_LENGTH, MAX_TAGS } from "@/constants/tags"

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

function parseDatetime(value?: string | null): Date | undefined {
  if (!value) return undefined
  try {
    return new Date(value)
  } catch {
    return undefined
  }
}

function parseTags(formData: FormData): string[] {
  try {
    return JSON.parse((formData.get("tags") as string) || "[]")
  } catch {
    return []
  }
}

export async function createTask(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" }
  }

  const raw = {
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    priority: formData.get("priority") || "MEDIUM",
    status: formData.get("status") || "TODO",
    tags: parseTags(formData),
    projectId: formData.get("projectId"),
    dueDate: formData.get("dueDate") || undefined,
  }

  const parsed = createTaskSchema.safeParse(raw)

  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  const project = await db.project.findUnique({
    where: { id: parsed.data.projectId, userId: session.user.id },
    select: { id: true },
  })

  if (!project) {
    return { success: false, error: "Project not found" }
  }

  const task = await db.task.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      priority: parsed.data.priority,
      status: parsed.data.status,
      tags: parsed.data.tags,
      projectId: parsed.data.projectId,
      userId: session.user.id,
      dueDate: parseDatetime(parsed.data.dueDate),
    },
    select: { id: true },
  })

  revalidatePath(AppRoutes.DASHBOARD.PROJECTS)
  return { success: true, data: { id: task.id } }
}

export async function updateTask(
  taskId: string,
  formData: FormData
): Promise<ActionResult<void>> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" }
  }

  const tags = parseTags(formData)
  const dueDateRaw = formData.get("dueDate") as string | null
  const raw = {
    title: formData.get("title") || undefined,
    description: formData.get("description") || undefined,
    priority: formData.get("priority") || undefined,
    status: formData.get("status") || undefined,
    tags: tags.length > 0 ? tags : undefined,
    projectId: formData.get("projectId") || undefined,
    dueDate: dueDateRaw !== null ? (dueDateRaw.trim() || null) : undefined,
  }

  const parsed = updateTaskSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  const existing = await db.task.findUnique({
    where: { id: taskId, userId: session.user.id },
    select: { id: true, projectId: true },
  })

  if (!existing) {
    return { success: false, error: "Task not found" }
  }

  if (parsed.data.projectId && parsed.data.projectId !== existing.projectId) {
    const project = await db.project.findUnique({
      where: { id: parsed.data.projectId, userId: session.user.id },
      select: { id: true },
    })
    if (!project) {
      return { success: false, error: "Project not found" }
    }
  }

  await db.task.update({
    where: { id: taskId, userId: session.user.id },
    data: {
      ...parsed.data,
      dueDate: parsed.data.dueDate === null
        ? null
        : parsed.data.dueDate
          ? parseDatetime(parsed.data.dueDate)
          : undefined,
    },
  })

  revalidatePath(AppRoutes.DASHBOARD.HOME)
  revalidatePath(AppRoutes.DASHBOARD.TASKS)
  revalidatePath(AppRoutes.DASHBOARD.PROJECTS)
  return { success: true, data: undefined }
}

export async function updateTaskStatus(
  taskId: string,
  formData: FormData
): Promise<ActionResult<void>> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" }
  }

  const raw = {
    status: formData.get("status"),
  }

  const parsed = updateTaskStatusSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  const existing = await db.task.findUnique({
    where: { id: taskId, userId: session.user.id },
    select: { id: true, projectId: true },
  })

  if (!existing) {
    return { success: false, error: "Task not found" }
  }

  await db.task.update({
    where: { id: taskId, userId: session.user.id },
    data: { status: parsed.data.status },
  })

  revalidatePath(AppRoutes.DASHBOARD.PROJECTS)
  return { success: true, data: undefined }
}

export async function addTaskTag(
  taskId: string,
  value: string,
): Promise<ActionResult<string[]>> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" }
  }

  const tag = value.trim().toLowerCase()
  if (!tag) return { success: false, error: "Tag is required" }
  if (tag.length > MAX_TAG_LENGTH) {
    return { success: false, error: `Tags must be at most ${MAX_TAG_LENGTH} characters` }
  }

  const task = await db.task.findUnique({
    where: { id: taskId, userId: session.user.id },
    select: { tags: true },
  })

  if (!task) return { success: false, error: "Task not found" }
  if (task.tags.includes(tag)) return { success: false, error: "Tag already added" }
  if (task.tags.length >= MAX_TAGS) {
    return { success: false, error: `Maximum ${MAX_TAGS} tags allowed` }
  }

  const tags = [...task.tags, tag]
  await db.task.update({
    where: { id: taskId, userId: session.user.id },
    data: { tags },
  })

  revalidatePath(AppRoutes.DASHBOARD.HOME)
  revalidatePath(AppRoutes.DASHBOARD.TASKS)
  revalidatePath(AppRoutes.DASHBOARD.PROJECTS)
  return { success: true, data: tags }
}

export async function duplicateTask(
  taskId: string
): Promise<ActionResult<{ id: string }>> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" }
  }

  const existing = await db.task.findUnique({
    where: { id: taskId, userId: session.user.id },
    select: { title: true, description: true, priority: true, status: true, tags: true, projectId: true, dueDate: true },
  })

  if (!existing) {
    return { success: false, error: "Task not found" }
  }

  const task = await db.task.create({
    data: {
      title: `${existing.title} (copy)`,
      description: existing.description,
      priority: existing.priority,
      status: existing.status,
      tags: existing.tags,
      projectId: existing.projectId,
      userId: session.user.id,
      dueDate: existing.dueDate,
    },
    select: { id: true },
  })

  revalidatePath(AppRoutes.DASHBOARD.HOME)
  revalidatePath(AppRoutes.DASHBOARD.TASKS)
  revalidatePath(AppRoutes.DASHBOARD.PROJECTS)
  return { success: true, data: { id: task.id } }
}

export async function deleteTask(
  taskId: string
): Promise<ActionResult<void>> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" }
  }

  const existing = await db.task.findUnique({
    where: { id: taskId, userId: session.user.id },
    select: { id: true },
  })

  if (!existing) {
    return { success: false, error: "Task not found" }
  }

  await db.task.delete({
    where: { id: taskId, userId: session.user.id },
  })

  revalidatePath(AppRoutes.DASHBOARD.HOME)
  revalidatePath(AppRoutes.DASHBOARD.TASKS)
  revalidatePath(AppRoutes.DASHBOARD.PROJECTS)
  return { success: true, data: undefined }
}
