"use client"

import { useState, useTransition } from "react"
import { useSession } from "next-auth/react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordRules } from "@/components/password-rules/password-rules"
import { usePasswordRules } from "@/hooks/use-password-rules"
import { changePassword } from "@/actions/settings"
import { INVALID_INPUT_CLASS } from "@/lib/form-styles"
import { cn } from "@/lib/utils"

interface SecuritySettingsProps {
  hasPassword: boolean
}

export function SecuritySettings({ hasPassword }: SecuritySettingsProps) {
  const { data: session } = useSession()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { showRules, setShowRules, passwordRules } = usePasswordRules(newPassword)

  const passwordMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword
  const passwordRulesWithMatch = [
    ...passwordRules,
    {
      text: "passwords match",
      valid: confirmPassword.length > 0 && !passwordMismatch,
    },
  ]
  const passwordInvalid =
    newPassword.length > 0 &&
    passwordRulesWithMatch.some((rule) => !rule.valid)
  const canSubmit =
    hasPassword &&
    currentPassword.length > 0 &&
    newPassword.length > 0 &&
    confirmPassword.length > 0 &&
    !passwordInvalid &&
    !passwordMismatch

  function resetForm() {
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  function handleSave() {
    setError("")
    setSaved(false)

    const formData = new FormData()
    formData.set("currentPassword", currentPassword)
    formData.set("newPassword", newPassword)
    formData.set("confirmPassword", confirmPassword)

    startTransition(async () => {
      const result = await changePassword(formData)

      if (!result.success) {
        setError(result.error)
        return
      }

      resetForm()
      setSaved(true)
    })
  }

  function PasswordToggle({
    visible,
    onClick,
    label,
  }: {
    visible: boolean
    onClick: () => void
    label: string
  }) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    )
  }

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

        <div className="space-y-3 border-t pt-5">
          <h3 className="text-sm font-semibold">Password</h3>

          {!hasPassword ? (
            <div className="rounded-md border bg-muted/40 px-4 py-3">
              <p className="text-sm text-muted-foreground">
                Password changes are only available for email/password accounts.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-1">
                <Label htmlFor="current-password">Current password</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(event) => { setCurrentPassword(event.target.value); setSaved(false) }}
                    autoComplete="current-password"
                    className="h-9 pr-11"
                  />
                  <PasswordToggle
                    visible={showCurrentPassword}
                    onClick={() => setShowCurrentPassword((value) => !value)}
                    label={showCurrentPassword ? "Hide current password" : "Show current password"}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="new-password">New password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(event) => { setNewPassword(event.target.value); setSaved(false) }}
                    onFocus={() => setShowRules(true)}
                    onBlur={() => setShowRules(newPassword.length > 0)}
                    autoComplete="new-password"
                    className={cn("h-9 pr-11", passwordInvalid && INVALID_INPUT_CLASS)}
                  />
                  <PasswordToggle
                    visible={showNewPassword}
                    onClick={() => setShowNewPassword((value) => !value)}
                    label={showNewPassword ? "Hide new password" : "Show new password"}
                  />
                  <div className="mt-2 md:absolute md:left-full md:top-0 md:ml-3 md:mt-0 md:w-64 md:z-50">
                    <PasswordRules
                      rules={passwordRulesWithMatch}
                      visible={showRules || newPassword.length > 0 || confirmPassword.length > 0}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="confirm-new-password">Confirm new password</Label>
                <div className="relative">
                  <Input
                    id="confirm-new-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) => { setConfirmPassword(event.target.value); setSaved(false) }}
                    autoComplete="new-password"
                    className={cn("h-9 pr-11", passwordMismatch && INVALID_INPUT_CLASS)}
                  />
                  <PasswordToggle
                    visible={showConfirmPassword}
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"}
                  />
                </div>
                {passwordMismatch && <p className="text-sm text-destructive">Passwords don&apos;t match</p>}
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}
              {saved && <p className="text-sm text-emerald-600">Password updated.</p>}

              <Button
                onClick={handleSave}
                disabled={isPending || !canSubmit}
                size="sm"
                className="h-9"
              >
                {isPending ? "Updating..." : "Update password"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
