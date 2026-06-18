"use client"

import { useSession } from "next-auth/react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ConnectedAccounts } from "./connected-accounts"
import { ChangePasswordForm } from "./change-password-form"

interface SecuritySettingsProps {
  hasPassword: boolean
  providers: string[]
}

export function SecuritySettings({ hasPassword, providers }: SecuritySettingsProps) {
  const { data: session } = useSession()

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Security</h2>
        <p className="text-sm text-muted-foreground">Manage your sign-in details.</p>
      </div>

      <div className="max-w-xl space-y-6">
        <div className="space-y-1">
          <Label htmlFor="account-email">Email</Label>
          <Input
            id="account-email"
            value={session?.user?.email ?? ""}
            readOnly
            disabled
            className="h-9 cursor-not-allowed bg-muted/30 text-foreground disabled:opacity-100"
          />
          <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
        </div>

        <ConnectedAccounts hasPassword={hasPassword} providers={providers} />
        <ChangePasswordForm hasPassword={hasPassword} />
      </div>
    </div>
  )
}
