"use server"

import { getTaskTags } from "@/lib/data/tasks"

export async function fetchTaskTags(): Promise<string[]> {
  return getTaskTags()
}
