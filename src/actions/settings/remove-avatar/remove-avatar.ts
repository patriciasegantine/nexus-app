'use server'

import { del } from '@vercel/blob'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { DEMO_ERROR, isDemoUser } from '@/lib/demo-guard'

export async function removeAvatar() {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' }
  if (isDemoUser(session.user.email)) return { success: false, error: DEMO_ERROR }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { image: true },
  })

  if (user?.image) {
    try {
      await del(user.image)
    } catch {
      // blob may not exist or belong to external provider — proceed anyway
    }
  }

  await db.user.update({
    where: { id: session.user.id },
    data: { image: null },
  })

  revalidatePath('/settings')

  return { success: true }
}
