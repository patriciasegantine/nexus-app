"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { AppRoutes } from "@/constants/routes"
import { db } from "@/lib/db"
import { updateTaskStatusSchema } from "@/validations/task"
import type { ActionResult } from "./shared"

export async function updateTaskStatus(
  taskId: string,
  formData: FormData
): Promise<ActionResult<void>> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" }
  }

  const parsed = updateTaskStatusSchema.safeParse({
    status: formData.get("status"),
  })
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  const existing = await db.task.findUnique({
    where: { id: taskId, userId: session.user.id },
    select: { id: true },
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
