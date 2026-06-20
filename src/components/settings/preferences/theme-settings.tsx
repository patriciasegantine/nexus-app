'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Moon, Sun, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SettingsSection } from '@/components/settings/settings-section'
import { cn } from '@/lib/utils'

const THEMES = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
] as const

export function ThemeSettings() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <SettingsSection title="Theme" description="Choose how Nexus looks for you.">
      <div className="flex gap-3">
        {THEMES.map(({ value, label, icon: Icon }) => (
          <Button
            key={value}
            variant="outline"
            className={cn(
              "flex flex-col items-center gap-2 h-auto py-3 px-5",
              mounted && theme === value && "border-foreground bg-muted"
            )}
            onClick={() => setTheme(value)}
          >
            <Icon className="h-4 w-4" />
            <span className="text-xs">{label}</span>
          </Button>
        ))}
      </div>
    </SettingsSection>
  )
}
