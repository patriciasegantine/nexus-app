'use client'

import { useState } from 'react'
import { Check, Copy, Mail, UserPlus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AppRoutes } from '@/constants/routes'

interface InviteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const SHARE_TEXT = 'Join me on Nexus Dashboard! Create your account here:'

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01C17.18 3.03 14.69 2 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42 1.55 1.56 2.41 3.63 2.41 5.83 0 4.54-3.7 8.23-8.24 8.23-1.48 0-2.93-.39-4.19-1.15l-.3-.17-3.12.82.83-3.04-.2-.32A8.32 8.32 0 0 1 3.8 11.9c.01-4.54 3.7-8.24 8.25-8.24M8.53 7.33c-.16 0-.43.06-.66.31C7.65 7.89 7 8.5 7 9.71c0 1.22.89 2.39 1 2.56.14.17 1.76 2.67 4.25 3.73.59.27 1.05.42 1.41.53.59.19 1.13.16 1.56.1.48-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.16-.48-.27-.25-.14-1.47-.74-1.69-.82-.23-.08-.37-.12-.56.12-.15.25-.63.81-.77.97-.15.17-.29.19-.54.07-.25-.13-1.04-.39-1.98-1.23-.73-.66-1.22-1.47-1.36-1.72-.14-.24 0-.39.13-.52.12-.11.26-.29.39-.43.14-.13.18-.24.27-.4.08-.17.04-.31-.03-.43-.06-.11-.54-1.35-.76-1.84-.21-.48-.43-.42-.59-.43-.15-.01-.33-.01-.51-.01" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  )
}

export function InviteDialog({ open, onOpenChange }: InviteDialogProps) {
  const [copied, setCopied] = useState(false)

  const inviteUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${AppRoutes.AUTH.REGISTER}`
    : ''

  function handleCopy() {
    navigator.clipboard.writeText(inviteUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: <WhatsAppIcon />,
      href: `https://wa.me/?text=${encodeURIComponent(`${SHARE_TEXT} ${inviteUrl}`)}`,
      colorClass: 'text-[#25D366]',
    },
    {
      name: 'X',
      icon: <XIcon />,
      href: `https://x.com/intent/tweet?url=${encodeURIComponent(inviteUrl)}&text=${encodeURIComponent(SHARE_TEXT)}`,
      colorClass: 'text-foreground',
    },
    {
      name: 'LinkedIn',
      icon: <LinkedInIcon />,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(inviteUrl)}`,
      colorClass: 'text-[#0A66C2]',
    },
    {
      name: 'Telegram',
      icon: <TelegramIcon />,
      href: `https://t.me/share/url?url=${encodeURIComponent(inviteUrl)}&text=${encodeURIComponent(SHARE_TEXT)}`,
      colorClass: 'text-[#26A5E4]',
    },
    {
      name: 'Email',
      icon: <Mail className="h-4 w-4" />,
      href: `mailto:?subject=${encodeURIComponent(SHARE_TEXT)}&body=${encodeURIComponent(`${SHARE_TEXT}\n\n${inviteUrl}`)}`,
      colorClass: 'text-[#6366f1]',
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-8 pt-10 sm:p-8" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-chart-1/10">
              <UserPlus className="h-4 w-4 text-chart-1" />
            </div>
            <div>
              <DialogTitle>Invite someone</DialogTitle>
              <DialogDescription>
                Share this link so someone can create their own account.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex gap-2 mt-4">
          <Input
            readOnly
            value={inviteUrl}
            className="h-9 text-sm font-mono"
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
          <Button
            size="sm"
            variant="outline"
            className="h-9 shrink-0 gap-1.5"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy
              </>
            )}
          </Button>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <span className="text-xs text-muted-foreground shrink-0">Share via</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="flex items-center justify-between gap-2">
          {shareLinks.map(({ name, icon, href, colorClass }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              title={name}
              className="flex flex-1 items-center justify-center rounded-lg border border-border py-3.5 transition-colors hover:bg-muted"
            >
              <span className={`[&_svg]:h-6 [&_svg]:w-6 ${colorClass}`}>{icon}</span>
            </a>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
