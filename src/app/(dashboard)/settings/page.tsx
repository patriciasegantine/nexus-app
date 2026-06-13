import { Separator } from '@/components/ui/separator'
import { DangerZone } from '@/components/settings/danger-zone'
import { ProfileSettings } from '@/components/settings/profile-settings'
import { ThemeSettings } from '@/components/settings/theme-settings'
import { PageHeader } from '@/components/ui/page-header'

export default function SettingsPage() {
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
      <DangerZone />
    </div>
  )
}
