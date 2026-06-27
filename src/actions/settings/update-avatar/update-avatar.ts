'use server'

import { put } from '@vercel/blob'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { DEMO_ERROR, isDemoUser } from '@/lib/demo-guard'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function updateAvatar(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' }
  if (isDemoUser(session.user.email)) return { success: false, error: DEMO_ERROR }

  const file = formData.get('avatar') as File
  if (!file || file.size === 0) return { success: false, error: 'No file provided' }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { success: false, error: 'File must be a JPEG, PNG, GIF, or WebP image' }
  }

  if (file.size > MAX_SIZE) {
    return { success: false, error: 'File must be under 5MB' }
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
