"use server"

import { z } from "zod"
import { auth } from "@/auth"
import { DELETE_ACCOUNT_CONFIRMATION } from "@/constants/settings"
import { db } from "@/lib/db"
import type { ActionResult } from "@/types/actions"
import { isDemoUser, DEMO_ERROR } from "@/lib/demo-guard"

const deleteAccountSchema = z.object({
  confirmation: z.literal(DELETE_ACCOUNT_CONFIRMATION, {
    errorMap: () => ({ message: `Type ${DELETE_ACCOUNT_CONFIRMATION} to confirm` }),
  }),
})

export async function deleteAccount(formData: FormData): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" }
  }

  if (isDemoUser(session.user.email)) {
    return { success: false, error: DEMO_ERROR }
  }

  const parsed = deleteAccountSchema.safeParse({
    confirmation: formData.get("confirmation"),
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true },
  })

  if (!user) {
    return { success: false, error: "User not found" }
  }

  await db.$transaction([
    db.verificationToken.deleteMany({ where: { identifier: user.email } }),
    db.user.delete({ where: { id: user.id } }),
  ])

  return { success: true, data: undefined }
}
