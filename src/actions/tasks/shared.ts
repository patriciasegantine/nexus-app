import { revalidatePath } from "next/cache"
import { AppRoutes } from "@/constants/routes"

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

export function parseDatetime(value?: string | null): Date | undefined {
  if (!value) return undefined
  try {
    return new Date(value)
  } catch {
    return undefined
  }
}

export function parseTags(formData: FormData): string[] {
  try {
    return JSON.parse((formData.get("tags") as string) || "[]")
  } catch {
    return []
  }
}

export function revalidateTaskPaths() {
  revalidatePath(AppRoutes.DASHBOARD.HOME)
  revalidatePath(AppRoutes.DASHBOARD.TASKS)
  revalidatePath(AppRoutes.DASHBOARD.PROJECTS)
}
