"use client"

import { useState, useTransition } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordRules } from "@/components/password-rules/password-rules"
import { usePasswordRules } from "@/hooks/use-password-rules"
import { changePassword } from "@/actions/settings"
import { INVALID_INPUT_CLASS } from "@/lib/form-styles"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

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

interface ChangePasswordFormProps {
  hasPassword: boolean
}

export function ChangePasswordForm({ hasPassword }: ChangePasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { showRules, setShowRules, passwordRules } = usePasswordRules(newPassword)

  const passwordMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword
  const passwordRulesWithMatch = [
    ...passwordRules,
    { text: "passwords match", valid: confirmPassword.length > 0 && !passwordMismatch },
  ]
  const passwordInvalid = newPassword.length > 0 && passwordRulesWithMatch.some((rule) => !rule.valid)
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
    const formData = new FormData()
    formData.set("currentPassword", currentPassword)
    formData.set("newPassword", newPassword)
    formData.set("confirmPassword", confirmPassword)

    startTransition(async () => {
      const result = await changePassword(formData)
      if (!result.success) {
        toast({ variant: "destructive", description: result.error })
        return
      }
      resetForm()
      toast({ description: "Password updated." })
    })
  }

  return (
    <div className="space-y-3">
      {!hasPassword ? (
        <p className="text-sm text-muted-foreground">
          Only available for email/password accounts.
        </p>
      ) : (
        <>
          <div className="space-y-1">
            <Label htmlFor="current-password">Current password</Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                autoComplete="current-password"
                className="h-9 pr-11"
              />
              <PasswordToggle
                visible={showCurrentPassword}
                onClick={() => setShowCurrentPassword((v) => !v)}
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
                onChange={(event) => setNewPassword(event.target.value)}
                onFocus={() => setShowRules(true)}
                onBlur={() => setShowRules(newPassword.length > 0)}
                autoComplete="new-password"
                className={cn("h-9 pr-11", passwordInvalid && INVALID_INPUT_CLASS)}
              />
              <PasswordToggle
                visible={showNewPassword}
                onClick={() => setShowNewPassword((v) => !v)}
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
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                className={cn("h-9 pr-11", passwordMismatch && INVALID_INPUT_CLASS)}
              />
              <PasswordToggle
                visible={showConfirmPassword}
                onClick={() => setShowConfirmPassword((v) => !v)}
                label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"}
              />
            </div>
            {passwordMismatch && <p className="text-sm text-destructive">Passwords don&apos;t match</p>}
          </div>

          <Button onClick={handleSave} disabled={isPending || !canSubmit} size="sm" className="h-9">
            {isPending ? "Updating..." : "Update password"}
          </Button>
        </>
      )}
    </div>
  )
}
