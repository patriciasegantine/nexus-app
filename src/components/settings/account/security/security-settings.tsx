"use client"

import { useSession } from "next-auth/react"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { SettingsSection } from "@/components/settings/settings-section"
import { ConnectedAccounts } from "./connected-accounts"
import { ChangePasswordForm } from "./change-password-form"

interface SecuritySettingsProps {
  hasPassword: boolean
  providers: string[]
}

export function SecuritySettings({ hasPassword, providers }: SecuritySettingsProps) {
  const { data: session } = useSession()

  return (
    <div className="space-y-8">
      <SettingsSection title="Email" description="Your sign-in address.">
        <Input
          id="account-email"
          aria-label="Email address"
          value={session?.user?.email ?? ""}
          readOnly
          disabled
          className="h-9 max-w-sm cursor-not-allowed bg-muted/30 text-foreground disabled:opacity-100"
        />
      </SettingsSection>

      <Separator />

      <SettingsSection
        title="Connected accounts"
        description="Sign-in methods linked to your account."
      >
        <ConnectedAccounts hasPassword={hasPassword} providers={providers} />
      </SettingsSection>

      <Separator />

      <SettingsSection
        title="Password"
        description="Change your password or set one for email sign-in."
      >
        <ChangePasswordForm hasPassword={hasPassword} />
      </SettingsSection>
    </div>
  )
}
