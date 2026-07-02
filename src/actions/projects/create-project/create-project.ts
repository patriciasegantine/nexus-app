"use server"

import { db } from "@/lib/db"
import { createProjectSchema } from "@/validations/project"
import { generateSlug, ensureUniqueSlug } from "@/lib/slug"
import type { ActionResult } from "@/types/actions"
import { requireProjectAuth, parseProjectFormData, revalidateProjectPaths } from "../project-action-utils"

export async function createProject(formData: FormData): Promise<ActionResult<{ id: string }>> {
  const auth = await requireProjectAuth()
  if ("error" in auth) return { success: false, error: auth.error }

  const parsed = createProjectSchema.safeParse(parseProjectFormData(formData))
  if (!parsed.success) return { success: false, error: parsed.error.errors[0].message }

  const slug = await ensureUniqueSlug(
    generateSlug(parsed.data.name),
    async (candidate) =>
      !!(await db.project.findUnique({ where: { slug: candidate }, select: { id: true } }))
  )

  const project = await db.project.create({
    data: {
      name: parsed.data.name,
      slug,
      description: parsed.data.description,
      color: parsed.data.color,
      tags: parsed.data.tags ?? [],
      status: parsed.data.status,
      priority: parsed.data.priority ?? null,
      startDate: parsed.data.startDate ? new Date(parsed.data.startDate) : null,
      targetDate: parsed.data.targetDate ? new Date(parsed.data.targetDate) : null,
      icon: parsed.data.icon ?? null,
      userId: auth.userId,
    },
    select: { id: true },
  })

  revalidateProjectPaths()
  return { success: true, data: { id: project.id } }
}
