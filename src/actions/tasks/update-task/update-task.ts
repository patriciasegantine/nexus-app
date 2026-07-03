"use server"

import { auth } from "@/auth"
import { ACTION_MESSAGES, PROJECT_MESSAGES, TASK_MESSAGES } from "@/constants/messages"
import { db } from "@/lib/db"
import { updateTaskSchema, updateTaskStatusSchema } from "@/validations/task"
import {
  parseDatetime,
  parseTags,
  revalidateTaskPaths,
  type ActionResult,
} from "../shared"
import { isDemoUser, DEMO_ERROR } from "@/lib/demo-guard"

export async function updateTask(
  taskId: string,
  formData: FormData
): Promise<ActionResult<void>> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: ACTION_MESSAGES.UNAUTHORIZED }
  }

  if (isDemoUser(session.user.email)) {
    return { success: false, error: DEMO_ERROR }
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
    return { success: false, error: TASK_MESSAGES.NOT_FOUND }
  }

  if (parsed.data.projectId && parsed.data.projectId !== existing.projectId) {
    const project = await db.project.findUnique({
      where: { id: parsed.data.projectId, userId: session.user.id },
      select: { id: true },
    })
    if (!project) {
      return { success: false, error: PROJECT_MESSAGES.NOT_FOUND }
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

  revalidateTaskPaths()
  return { success: true, data: undefined }
}

export async function updateTaskStatus(
  taskId: string,
  formData: FormData
): Promise<ActionResult<void>> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: ACTION_MESSAGES.UNAUTHORIZED }
  }

  const parsed = updateTaskStatusSchema.safeParse({
    status: formData.get("status"),
  })
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  // Demo exception: report success without persisting (and without revalidating,
  // which would refetch and undo the optimistic move). The kanban drag works for
  // the session, but the shared demo workspace stays untouched.
  if (isDemoUser(session.user.email)) {
    return { success: true, data: undefined }
  }

  const existing = await db.task.findUnique({
    where: { id: taskId, userId: session.user.id },
    select: { id: true },
  })

  if (!existing) {
    return { success: false, error: TASK_MESSAGES.NOT_FOUND }
  }

  await db.task.update({
    where: { id: taskId, userId: session.user.id },
    data: { status: parsed.data.status },
  })

  revalidateTaskPaths()
  return { success: true, data: undefined }
}
