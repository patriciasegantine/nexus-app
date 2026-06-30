"use server"

import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { AppRoutes } from "@/constants/routes"
import { parseTags } from "@/actions/shared"
import { isDemoUser, DEMO_ERROR } from "@/lib/demo-guard"

type AuthSuccess = { userId: string }
type AuthFailure = { error: string }

export async function requireProjectAuth(): Promise<AuthSuccess | AuthFailure> {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }
  if (isDemoUser(session.user.email)) return { error: DEMO_ERROR }
  return { userId: session.user.id }
}

export function parseProjectFormData(formData: FormData) {
  return {
    name: formData.get("name") || undefined,
    description: formData.get("description") || undefined,
    color: formData.get("color") || undefined,
    tags: parseTags(formData),
    status: formData.get("status") || undefined,
    priority: formData.get("priority") || undefined,
    startDate: formData.get("startDate") || undefined,
    targetDate: formData.get("targetDate") || undefined,
    icon: formData.get("icon") || undefined,
  }
}

export function revalidateProjectPaths() {
  revalidatePath(AppRoutes.DASHBOARD.PROJECTS)
  revalidatePath(AppRoutes.DASHBOARD.HOME)
}
