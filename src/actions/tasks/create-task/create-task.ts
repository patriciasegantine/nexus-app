"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { AppRoutes } from "@/constants/routes"
import { db } from "@/lib/db"
import { createTaskSchema } from "@/validations/task"
import { parseDatetime, parseTags, type ActionResult } from "../shared"
import { isDemoUser, DEMO_ERROR } from "@/lib/demo-guard"

export async function createTask(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" }
  }

  if (isDemoUser(session.user.email)) {
    return { success: false, error: DEMO_ERROR }
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
