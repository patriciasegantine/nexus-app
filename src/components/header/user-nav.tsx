'use client'

import { useState, useCallback } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { UserAvatar } from "@/components/ui/user-avatar"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { AppRoutes } from "@/constants/routes"
import { Plus, User, SlidersHorizontal, Shield, UserPlus, Keyboard, LogOut, type LucideIcon } from "lucide-react"
import { KeyboardShortcutsDialog } from "@/components/header/keyboard-shortcuts-dialog"
import { InviteDialog } from "@/components/header/invite-dialog"
import { useKeyboardNavigation } from "@/hooks/use-keyboard-navigation"

type NavLink = { type: 'link'; href: string; icon: LucideIcon; label: string }
type NavAction = { type: 'action'; icon: LucideIcon; label: string; onSelect: () => void; shortcut?: string; opensDialog?: boolean }
type NavItem = NavLink | NavAction

interface UserNavProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function UserNav({ user }: UserNavProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const [inviteOpen, setInviteOpen] = useState(false)

  const openShortcuts = useCallback(() => setShortcutsOpen(true), [])

  useKeyboardNavigation(openShortcuts)

  const sections: NavItem[][] = [
    [
      { type: 'link', href: AppRoutes.DASHBOARD.TASKS, icon: Plus, label: 'New task' },
      { type: 'link', href: AppRoutes.DASHBOARD.PROJECTS, icon: Plus, label: 'New project' },
      { type: 'link', href: AppRoutes.DASHBOARD.SETTINGS_PROFILE, icon: User, label: 'Profile' },
    ],
    [
      { type: 'action', icon: Keyboard, label: 'Keyboard shortcuts', onSelect: openShortcuts, opensDialog: true },
      { type: 'action', icon: UserPlus, label: 'Invite someone', onSelect: () => setInviteOpen(true), opensDialog: true },
    ],
    [
      { type: 'action', icon: LogOut, label: 'Log out', onSelect: () => signOut({ callbackUrl: '/login' }) },
    ],
  ]

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:bg-secondary">
            <UserAvatar src={user.image} name={user.name ?? 'U'} size="md" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>

          {sections.map((section, si) => (
            <span key={si}>
              <DropdownMenuSeparator />
              {section.map((item) =>
                item.type === 'link' ? (
                  <DropdownMenuItem key={item.label} asChild>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    key={item.label}
                    onSelect={(e) => {
                      if (item.opensDialog) {
                        e.preventDefault()
                        setDropdownOpen(false)
                      }
                      item.onSelect()
                    }}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                    {item.shortcut && <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>}
                  </DropdownMenuItem>
                )
              )}
            </span>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <KeyboardShortcutsDialog open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
      <InviteDialog open={inviteOpen} onOpenChange={setInviteOpen} />
    </>
  )
}
