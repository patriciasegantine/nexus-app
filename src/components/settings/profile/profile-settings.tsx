'use client'

import { useSession } from 'next-auth/react'
import { useTransition, useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { SettingsSection } from '@/components/settings/settings-section'
import { AvatarUpload } from '@/components/settings/profile/avatar-upload'
import { updateProfile } from '@/actions/settings'
import { toast } from '@/hooks/use-toast'

export function ProfileSettings() {
  const { data: session, update } = useSession()
  const [name, setName] = useState('')
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (session?.user?.name) setName(session.user.name)
  }, [session?.user?.name])

  const isDirty = name !== (session?.user?.name ?? '')
  const isValid = name.trim().length >= 2

  function handleSave() {
    const formData = new FormData()
    formData.set('name', name)

    startTransition(async () => {
      const result = await updateProfile(formData)
      if (!result.success) {
        toast({ variant: 'destructive', description: result.error })
        return
      }
      await update({ name: name.trim() })
      toast({ description: 'Name updated.' })
    })
  }

  return (
    <SettingsSection title="Profile" description="Manage your personal information.">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
        <AvatarUpload
          src={session?.user?.image}
          name={name || session?.user?.name || 'U'}
          onSave={async (url) => { await update({ image: url }) }}
        />

        <div className="min-w-0 flex-1 space-y-1">
          <Label htmlFor="profile-name">Name</Label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="h-9"
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
        </div>
      </div>
    </SettingsSection>
  )
}
