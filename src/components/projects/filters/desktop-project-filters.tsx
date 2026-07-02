import { ArrowUpDown, Grid2X2, List, SlidersHorizontal, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DesktopProjectFiltersProps {
  tag: string
  sort: string
  tags: string[]
  activeCount: number
  hasAnyFilter: boolean
  view: "list" | "cards"
  onFilterChange: (key: string, value: string | null) => void
  onClear: () => void
}

export function DesktopProjectFilters({
  tag,
  sort,
  tags,
  activeCount,
  hasAnyFilter,
  view,
  onFilterChange,
  onClear,
}: DesktopProjectFiltersProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="hidden items-center gap-2 md:flex">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-10 shrink-0 gap-2 border-border/90 bg-card px-4 shadow-sm"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeCount > 0 && (
                <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                  {activeCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 space-y-4 p-4" align="end">
            <div className="space-y-1.5">
              <p className="text-sm font-medium">Tag</p>
              <Select value={tag || "_all"} onValueChange={(v) => onFilterChange("tag", v === "_all" ? null : v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All tags" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_all">All tags</SelectItem>
                  {tags.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-10 shrink-0 gap-2 border-border/90 bg-card px-4 shadow-sm"
            >
              <ArrowUpDown className="h-4 w-4" />
              Sort
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2" align="end">
            {[
              { value: "createdAt", label: "Newest first" },
              { value: "name", label: "Name" },
              { value: "progress", label: "Progress" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => onFilterChange("sort", option.value)}
                className={`w-full text-left px-3 py-1.5 rounded-sm text-sm hover:bg-muted transition-colors ${sort === option.value ? "font-medium text-foreground" : "text-muted-foreground"}`}
              >
                {option.label}
              </button>
            ))}
          </PopoverContent>
        </Popover>

        <div className="h-6 w-px bg-border" />

        <div className="flex items-center gap-1 rounded-md border border-border/60 bg-card p-0.5 shadow-sm">
          <button
            type="button"
            aria-label="Card view"
            onClick={() => onFilterChange("view", "cards")}
            className={`rounded p-1.5 transition-colors ${view === "cards" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Grid2X2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="List view"
            onClick={() => onFilterChange("view", null)}
            className={`rounded p-1.5 transition-colors ${view === "list" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {hasAnyFilter && (
        <Button
          variant="ghost"
          size="sm"
          className="h-10 shrink-0 gap-1.5 text-muted-foreground"
          onClick={onClear}
        >
          <X className="h-4 w-4" />
          <span className="hidden md:inline">Clear filters</span>
        </Button>
      )}
    </div>
  )
}
