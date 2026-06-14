"use server"

import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function fetchProjects(): Promise<{ id: string; name: string }[]> {
  const session = await auth()
  if (!session?.user?.id) return []

  return db.project.findMany({
    where: { userId: session.user.id },
    select: { id: true, name: true },
    orderBy: { createdAt: "desc" },
  })
}
