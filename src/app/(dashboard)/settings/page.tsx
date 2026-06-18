import { Separator } from '@/components/ui/separator'
import { SettingsTabs } from '@/components/settings/settings-tabs'
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
      <SettingsTabs hasPassword={Boolean(user?.password)} />
    </div>
  )
}
