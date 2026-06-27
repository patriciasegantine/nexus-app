'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

type ThemeToggleProps = {
  showTooltip?: boolean
  className?: string
}

export function ThemeToggle({ showTooltip = false, className }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false)
  const {theme, setTheme} = useTheme()
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) return null

  const label = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'

  const button = (
    <Button
      variant="ghost"
      size="icon"
      className={cn("h-9 w-9", className)}
      aria-label={label}
      title={showTooltip ? undefined : label}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? (
        <Sun className="h-[1.35rem] w-[1.35rem] rotate-0 scale-100 transition-all"/>
      ) : (
        <Moon className="h-[1.35rem] w-[1.35rem] rotate-0 scale-100 transition-all"/>
      )}
    </Button>
  )

  if (!showTooltip) return button

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          {button}
        </TooltipTrigger>
        <TooltipContent side="bottom" className="pointer-events-none">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
