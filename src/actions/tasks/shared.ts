import { revalidatePath } from "next/cache"
import { AppRoutes } from "@/constants/routes"

export type { ActionResult } from "@/types/actions"
export { parseTags, parseDatetime } from "@/actions/shared"

export function revalidateTaskPaths() {
  revalidatePath(AppRoutes.DASHBOARD.HOME)
  revalidatePath(AppRoutes.DASHBOARD.TASKS)
  revalidatePath(AppRoutes.DASHBOARD.PROJECTS)
}
