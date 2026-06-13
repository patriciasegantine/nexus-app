'use client'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'

interface CollapseToggleProps {
  isCollapsed: boolean
  onToggle: () => void
}

export function CollapseToggle({ isCollapsed, onToggle }: CollapseToggleProps) {
  const label = isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
  const Icon = isCollapsed ? PanelLeftOpen : PanelLeftClose

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="hidden h-9 w-9 md:inline-flex"
            onClick={onToggle}
            aria-label={label}
          >
            <Icon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="pointer-events-none">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
