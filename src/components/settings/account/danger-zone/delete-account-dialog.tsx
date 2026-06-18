"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { deleteAccount } from "@/actions/settings"
import { DELETE_ACCOUNT_CONFIRMATION } from "@/constants/settings"

export function DeleteAccountDialog() {
  const [open, setOpen] = useState(false)
  const [confirmInput, setConfirmInput] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  function handleOpenChange(value: boolean) {
    if (!loading) {
      setOpen(value)
      if (!value) setConfirmInput("")
    }
  }

  async function handleDeleteAccount() {
    setLoading(true)
    const formData = new FormData()
    formData.set("confirmation", confirmInput)
    const result = await deleteAccount(formData)
    setLoading(false)

    if (result.success) {
      setOpen(false)
      toast({ description: "Account deleted." })
      await signOut({ callbackUrl: "/login" })
    } else {
      toast({ variant: "destructive", description: result.error })
    }
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3">
      <div>
        <p className="text-sm font-medium">Delete account</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Permanently remove your account and all associated data.
        </p>
      </div>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button variant="destructive" className="shrink-0">
            Delete account
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete account?</DialogTitle>
            <DialogDescription>
              This will permanently delete your account, projects, tasks, sessions, and connected sign-in records.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <Label htmlFor="confirm-delete-input">
              Type <span className="font-mono font-semibold text-foreground">{DELETE_ACCOUNT_CONFIRMATION}</span> to confirm
            </Label>
            <Input
              id="confirm-delete-input"
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              placeholder={DELETE_ACCOUNT_CONFIRMATION}
              className="placeholder:text-muted-foreground/60"
              disabled={loading}
              autoComplete="off"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={confirmInput !== DELETE_ACCOUNT_CONFIRMATION || loading}
              onClick={handleDeleteAccount}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
