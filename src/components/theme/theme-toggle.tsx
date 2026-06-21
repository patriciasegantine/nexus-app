'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useEffect, useState } from 'react'

type ThemeToggleProps = {
  showTooltip?: boolean
}

export function ThemeToggle({ showTooltip = false }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false)
  const {theme, setTheme} = useTheme()
  
  // Evita hidratação incorreta
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) return null

  const label = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'

  const button = (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9"
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
