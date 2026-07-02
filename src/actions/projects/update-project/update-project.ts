"use server"

import { db } from "@/lib/db"
import { updateProjectSchema } from "@/validations/project"
import { generateSlug, ensureUniqueSlug } from "@/lib/slug"
import type { ActionResult } from "@/types/actions"
import { requireProjectAuth, parseProjectFormData, revalidateProjectPaths } from "../project-action-utils"

export async function updateProject(projectId: string, formData: FormData): Promise<ActionResult<void>> {
  const auth = await requireProjectAuth()
  if ("error" in auth) return { success: false, error: auth.error }

  const parsed = updateProjectSchema.safeParse(parseProjectFormData(formData))
  if (!parsed.success) return { success: false, error: parsed.error.errors[0].message }

  const existing = await db.project.findUnique({
    where: { id: projectId, userId: auth.userId },
    select: { id: true, name: true },
  })
  if (!existing) return { success: false, error: "Project not found" }

  let slug: string | undefined
  if (parsed.data.name && parsed.data.name !== existing.name) {
    slug = await ensureUniqueSlug(
      generateSlug(parsed.data.name),
      async (candidate) => {
        const found = await db.project.findUnique({ where: { slug: candidate }, select: { id: true } })
        return !!(found && found.id !== projectId)
      }
    )
  }

  const { startDate, targetDate, priority, icon, ...rest } = parsed.data
  await db.project.update({
    where: { id: projectId, userId: auth.userId },
    data: {
      ...rest,
      ...(slug ? { slug } : {}),
      ...("startDate" in parsed.data ? { startDate: startDate ? new Date(startDate) : null } : {}),
      ...("targetDate" in parsed.data ? { targetDate: targetDate ? new Date(targetDate) : null } : {}),
      ...("priority" in parsed.data ? { priority: priority ?? null } : {}),
      ...("icon" in parsed.data ? { icon: icon ?? null } : {}),
    },
  })

  revalidateProjectPaths()
  return { success: true, data: undefined }
}
