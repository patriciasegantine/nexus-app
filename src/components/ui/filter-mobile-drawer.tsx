import type { ReactNode } from "react"
import { SlidersHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

interface FilterMobileDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  activeCount: number
  description: string
  onClear: () => void
  children: ReactNode
}

export function FilterMobileDrawer({
  open,
  onOpenChange,
  activeCount,
  description,
  onClear,
  children,
}: FilterMobileDrawerProps) {
  function handleClear() {
    onClear()
    onOpenChange(false)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative h-10 w-10 shrink-0 md:hidden"
          aria-label="More filters"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {activeCount > 0 && (
            <Badge
              variant="secondary"
              className="absolute -right-1.5 -top-1.5 h-5 min-w-5 px-1 text-[10px]"
            >
              {activeCount}
            </Badge>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="md:hidden">
        <DrawerHeader>
          <DrawerTitle>Filters</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <div className="space-y-4">{children}</div>
        </DrawerBody>
        <DrawerFooter>
          {activeCount > 0 && (
            <Button variant="outline" className="flex-1" onClick={handleClear}>
              Clear filters
            </Button>
          )}
          <Button className="flex-1" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
