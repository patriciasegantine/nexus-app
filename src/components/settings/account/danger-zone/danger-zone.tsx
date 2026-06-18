"use client"

import { ClearDataDialog } from "@/components/settings/account/danger-zone/clear-data-dialog"
import { DeleteAccountDialog } from "@/components/settings/account/danger-zone/delete-account-dialog"

export function DangerZone() {
  return (
    <div className="rounded-lg border border-destructive/40 p-6 space-y-4">
      <div className="space-y-1">
        <h2 className="text-base font-semibold text-destructive">Danger Zone</h2>
        <p className="text-sm text-muted-foreground">
          Permanently delete workspace data or your account. These actions cannot be undone.
        </p>
      </div>

      <ClearDataDialog />
      <DeleteAccountDialog />
    </div>
  )
}
