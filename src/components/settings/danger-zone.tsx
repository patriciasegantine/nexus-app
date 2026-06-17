"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { clearAllData, deleteAccount } from "@/actions/settings"
import { CLEAR_DATA_CONFIRMATION, DELETE_ACCOUNT_CONFIRMATION } from "@/constants/settings"

export function DangerZone() {
  const [clearOpen, setClearOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [confirmInput, setConfirmInput] = useState("")
  const [deleteConfirmInput, setDeleteConfirmInput] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  function handleClearOpenChange(value: boolean) {
    if (!loading) {
      setClearOpen(value)
      if (!value) setConfirmInput("")
    }
  }

  function handleDeleteOpenChange(value: boolean) {
    if (!loading) {
      setDeleteOpen(value)
      if (!value) setDeleteConfirmInput("")
    }
  }

  async function handleClear() {
    setLoading(true)
    const formData = new FormData()
    formData.set("confirmation", confirmInput)
    const result = await clearAllData(formData)
    setLoading(false)

    if (result.success) {
      setClearOpen(false)
      toast({ description: "All data cleared successfully." })
      router.push("/")
    } else {
      toast({ variant: "destructive", description: result.error })
    }
  }

  async function handleDeleteAccount() {
    setLoading(true)
    const formData = new FormData()
    formData.set("confirmation", deleteConfirmInput)
    const result = await deleteAccount(formData)
    setLoading(false)

    if (result.success) {
      setDeleteOpen(false)
      toast({ description: "Account deleted." })
      await signOut({ callbackUrl: "/login" })
    } else {
      toast({ variant: "destructive", description: result.error })
    }
  }

  return (
    <div className="rounded-lg border border-destructive/40 p-6 space-y-4">
      <div className="space-y-1">
        <h2 className="text-base font-semibold text-destructive">Danger Zone</h2>
        <p className="text-sm text-muted-foreground">
          Permanently delete workspace data or your account. These actions cannot be undone.
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3">
        <div>
          <p className="text-sm font-medium">Clear all data</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Remove all projects and tasks from your workspace.
          </p>
        </div>

        <Dialog open={clearOpen} onOpenChange={handleClearOpenChange}>
          <DialogTrigger asChild>
            <Button variant="outline" className="shrink-0 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
              Clear all data
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Clear all data?</DialogTitle>
              <DialogDescription>
                This will permanently delete all your projects and tasks. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2 py-2">
              <Label htmlFor="confirm-input">
                Type <span className="font-mono font-semibold text-foreground">{CLEAR_DATA_CONFIRMATION}</span> to confirm
              </Label>
              <Input
                id="confirm-input"
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                placeholder={CLEAR_DATA_CONFIRMATION}
                className="placeholder:text-muted-foreground/60"
                disabled={loading}
                autoComplete="off"
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => handleClearOpenChange(false)} disabled={loading}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={confirmInput !== CLEAR_DATA_CONFIRMATION || loading}
                onClick={handleClear}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Clear all data
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center justify-between gap-4 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3">
        <div>
          <p className="text-sm font-medium">Delete account</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Permanently remove your account and all associated data.
          </p>
        </div>

        <Dialog open={deleteOpen} onOpenChange={handleDeleteOpenChange}>
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
              <Label htmlFor="delete-account-confirm-input">
                Type <span className="font-mono font-semibold text-foreground">{DELETE_ACCOUNT_CONFIRMATION}</span> to confirm
              </Label>
              <Input
                id="delete-account-confirm-input"
                value={deleteConfirmInput}
                onChange={(event) => setDeleteConfirmInput(event.target.value)}
                placeholder={DELETE_ACCOUNT_CONFIRMATION}
                className="placeholder:text-muted-foreground/60"
                disabled={loading}
                autoComplete="off"
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => handleDeleteOpenChange(false)} disabled={loading}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={deleteConfirmInput !== DELETE_ACCOUNT_CONFIRMATION || loading}
                onClick={handleDeleteAccount}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Delete account
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
