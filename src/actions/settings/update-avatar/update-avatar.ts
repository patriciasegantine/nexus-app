'use server'

import { put } from '@vercel/blob'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { DEMO_ERROR, isDemoUser } from '@/lib/demo-guard'
import { ACTION_MESSAGES, SETTINGS_MESSAGES } from '@/constants/messages'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function updateAvatar(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: ACTION_MESSAGES.UNAUTHORIZED }
  if (isDemoUser(session.user.email)) return { success: false, error: DEMO_ERROR }

  const file = formData.get('avatar') as File
  if (!file || file.size === 0) return { success: false, error: SETTINGS_MESSAGES.AVATAR_FILE_REQUIRED }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { success: false, error: SETTINGS_MESSAGES.AVATAR_FILE_TYPE_INVALID }
  }

  if (file.size > MAX_SIZE) {
    return { success: false, error: SETTINGS_MESSAGES.AVATAR_FILE_TOO_LARGE }
  }

  const ext = file.type.split('/')[1]
  const blob = await put(`avatars/${session.user.id}-${Date.now()}.${ext}`, file, {
    access: 'public',
  })

  await db.user.update({
    where: { id: session.user.id },
    data: { image: blob.url },
  })

  revalidatePath('/settings')

  return { success: true, url: blob.url }
}
