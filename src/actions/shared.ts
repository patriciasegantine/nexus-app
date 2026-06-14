export type { ActionResult } from "@/types/actions"

export function parseTags(formData: FormData): string[] {
  try {
    return JSON.parse((formData.get("tags") as string) || "[]")
  } catch {
    return []
  }
}

export function parseDatetime(value?: string | null): Date | undefined {
  if (!value) return undefined
  try {
    return new Date(value)
  } catch {
    return undefined
  }
}
