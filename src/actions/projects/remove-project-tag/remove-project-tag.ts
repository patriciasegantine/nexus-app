"use server"

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { AppRoutes } from "@/constants/routes"
import type { ActionResult } from "@/types/actions"

export async function removeProjectTag(
  projectId: string,
  tag: string,
): Promise<ActionResult<string[]>> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" }
  }

  const project = await db.project.findUnique({
    where: { id: projectId, userId: session.user.id },
    select: { tags: true },
  })

  if (!project) return { success: false, error: "Project not found" }

  const tags = project.tags.filter((t) => t !== tag)
  await db.project.update({
    where: { id: projectId, userId: session.user.id },
    data: { tags },
  })

  revalidatePath(AppRoutes.DASHBOARD.PROJECTS)
  revalidatePath(AppRoutes.DASHBOARD.HOME)
  return { success: true, data: tags }
}
