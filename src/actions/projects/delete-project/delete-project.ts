"use server"

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { AppRoutes } from "@/constants/routes"
import type { ActionResult } from "@/types/actions"
import { isDemoUser, DEMO_ERROR } from "@/lib/demo-guard"

export async function deleteProject(
  projectId: string
): Promise<ActionResult<void>> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" }
  }

  if (isDemoUser(session.user.email)) {
    return { success: false, error: DEMO_ERROR }
  }

  const existing = await db.project.findUnique({
    where: { id: projectId, userId: session.user.id },
    select: { id: true },
  })

  if (!existing) {
    return { success: false, error: "Project not found" }
  }

  await db.project.delete({
    where: { id: projectId, userId: session.user.id },
  })

  revalidatePath(AppRoutes.DASHBOARD.PROJECTS)
  revalidatePath(AppRoutes.DASHBOARD.HOME)
  return { success: true, data: undefined }
}
