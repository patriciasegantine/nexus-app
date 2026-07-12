"use server"

import { getProjectTags } from "@/lib/data/projects"

export async function fetchProjectTags(): Promise<string[]> {
  return getProjectTags()
}
