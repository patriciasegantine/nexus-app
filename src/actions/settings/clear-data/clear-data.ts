"use server"

import { z } from "zod"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { AppRoutes } from "@/constants/routes"
import { CLEAR_DATA_CONFIRMATION } from "@/constants/settings"
import type { ActionResult } from "@/types/actions"
import { isDemoUser, DEMO_ERROR } from "@/lib/demo-guard"

const clearAllDataSchema = z.object({
  confirmation: z.literal(CLEAR_DATA_CONFIRMATION, {
    errorMap: () => ({ message: `Type ${CLEAR_DATA_CONFIRMATION} to confirm` }),
  }),
})

export async function clearAllData(formData: FormData): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" }
  }

  if (isDemoUser(session.user.email)) {
    return { success: false, error: DEMO_ERROR }
  }

  const parsed = clearAllDataSchema.safeParse({
    confirmation: formData.get("confirmation"),
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  const userId = session.user.id

  await db.$transaction([
    db.task.deleteMany({ where: { userId } }),
    db.project.deleteMany({ where: { userId } }),
  ])

  revalidatePath(AppRoutes.DASHBOARD.HOME)
  return { success: true, data: undefined }
}
