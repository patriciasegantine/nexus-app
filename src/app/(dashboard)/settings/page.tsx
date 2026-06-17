import { Separator } from '@/components/ui/separator'
import { DangerZone } from '@/components/settings/danger-zone'
import { ProfileSettings } from '@/components/settings/profile-settings'
import { SecuritySettings } from '@/components/settings/security-settings'
import { ThemeSettings } from '@/components/settings/theme-settings'
import { PageHeader } from '@/components/ui/page-header'
import { auth } from '@/auth'
import { db } from '@/lib/db'

export default async function SettingsPage() {
  const session = await auth()
  const user = session?.user?.id
    ? await db.user.findUnique({
        where: { id: session.user.id },
        select: { password: true },
      })
    : null

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account and workspace preferences."
      />

      <Separator />
      <ProfileSettings />
      <Separator />
      <ThemeSettings />
      <Separator />
      <SecuritySettings hasPassword={Boolean(user?.password)} />
      <Separator />
      <DangerZone />
    </div>
  )
}
