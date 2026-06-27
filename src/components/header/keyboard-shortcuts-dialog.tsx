'use client'

import { Keyboard } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type ShortcutGroup = {
  label: string
  items: { keys: string[]; description: string }[]
}

const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    label: 'Navigation',
    items: [
      { keys: ['N', 'O'], description: 'Go to Overview' },
      { keys: ['N', 'P'], description: 'Go to Projects' },
      { keys: ['N', 'T'], description: 'Go to Tasks' },
      { keys: ['N', 'S'], description: 'Go to Settings' },
    ],
  },
  {
    label: 'Help',
    items: [
      { keys: ['N', '?'], description: 'Open keyboard shortcuts' },
    ],
  },
]

interface KeyboardShortcutsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function KeyboardShortcutsDialog({ open, onOpenChange }: KeyboardShortcutsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-8 pt-10 sm:p-8" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-chart-1/10">
              <Keyboard className="h-4 w-4 text-chart-1" />
            </div>
            <DialogTitle>Keyboard shortcuts</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-3">
          {SHORTCUT_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground px-3">
                {group.label}
              </p>
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <li key={item.description} className="flex items-center justify-between gap-4 rounded-md px-3 py-2.5 hover:bg-muted">
                    <span className="text-sm text-foreground">{item.description}</span>
                    <span className="flex items-center gap-1.5 shrink-0">
                      {item.keys.map((key, i) => (
                        <span key={key} className="flex items-center gap-1.5">
                          {i > 0 && <span className="text-[10px] text-muted-foreground">then</span>}
                          <kbd className="inline-flex h-7 min-w-7 items-center justify-center rounded-md border border-border bg-muted px-2.5 font-mono text-[11px] font-medium text-foreground shadow-sm">
                            {key}
                          </kbd>
                        </span>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
