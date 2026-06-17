'use client'

import { useSession } from 'next-auth/react'
import { useTransition, useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { UserAvatar } from '@/components/ui/user-avatar'
import { updateProfile } from '@/actions/settings'

export function ProfileSettings() {
  const { data: session, update } = useSession()
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (session?.user?.name) setName(session.user.name)
  }, [session?.user?.name])

  const isDirty = name !== (session?.user?.name ?? '')
  const isValid = name.trim().length >= 2

  function handleSave() {
    setError('')
    setSaved(false)
    const formData = new FormData()
    formData.set('name', name)

    startTransition(async () => {
      const result = await updateProfile(formData)
      if (!result.success) {
        setError(result.error)
        return
      }
      await update({ name: name.trim() })
      setSaved(true)
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Profile</h2>
        <p className="text-sm text-muted-foreground">Manage your personal information.</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
        <div className="shrink-0 pt-1">
          <UserAvatar src={session?.user?.image} name={name || session?.user?.name || 'U'} size="xl" />
        </div>

        <div className="min-w-0 flex-1 space-y-4">
          <div className="space-y-1">
            <Label htmlFor="profile-name">Name</Label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                id="profile-name"
                value={name}
                onChange={(e) => { setName(e.target.value); setSaved(false) }}
                placeholder="Your name"
                className="h-9 sm:max-w-xl"
              />
              <Button
                onClick={handleSave}
                disabled={isPending || !isDirty || !isValid}
                size="sm"
                className="h-9 shrink-0 sm:min-w-16"
              >
                {isPending ? 'Saving…' : 'Save'}
              </Button>
            </div>
            <div className="min-h-5">
              {error && <p className="text-sm text-destructive">{error}</p>}
              {saved && <p className="text-sm text-emerald-600">Name updated.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
