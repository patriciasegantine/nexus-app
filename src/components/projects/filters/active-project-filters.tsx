import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ActiveProjectFiltersProps {
  tag: string
  onRemove: (key: "tag") => void
}

export function ActiveProjectFilters({ tag, onRemove }: ActiveProjectFiltersProps) {
  if (!tag) return null

  return (
    <div className="flex flex-wrap gap-1.5">
      {tag && (
        <Badge
          variant="secondary"
          className="gap-1 cursor-pointer hover:bg-destructive/10 hover:text-destructive"
          onClick={() => onRemove("tag")}
        >
          {tag}
          <X className="h-3 w-3" />
        </Badge>
      )}
    </div>
  )
}
