"use server"

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { generateSlug, ensureUniqueSlug } from "@/lib/slug"
import { AppRoutes } from "@/constants/routes"
import type { ActionResult } from "@/types/actions"
import { SAMPLE_PROJECTS } from "./sample-data"

export async function populateSampleData(): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" }
  }

  const userId = session.user.id

  const existingCount = await db.project.count({ where: { userId } })
  if (existingCount > 0) {
    return { success: false, error: "Your workspace already has projects" }
  }

  const projectsWithSlugs = await Promise.all(
    SAMPLE_PROJECTS.map(async (p) => ({
      ...p,
      slug: await ensureUniqueSlug(
        generateSlug(p.name),
        async (candidate) =>
          !!(await db.project.findUnique({ where: { slug: candidate }, select: { id: true } }))
      ),
    }))
  )

  await db.$transaction(async (tx) => {
    for (const { tasks, slug, ...projectData } of projectsWithSlugs) {
      const project = await tx.project.create({
        data: { ...projectData, slug, userId },
        select: { id: true },
      })

      for (const task of tasks) {
        await tx.task.create({
          data: { ...task, projectId: project.id, userId },
        })
      }
    }
  })

  revalidatePath(AppRoutes.DASHBOARD.HOME)
  return { success: true, data: undefined }
}
