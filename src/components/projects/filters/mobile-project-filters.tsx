import { FilterField } from "@/components/ui/filter-field"
import { FilterMobileDrawer } from "@/components/ui/filter-mobile-drawer"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface MobileProjectFiltersProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  activeCount: number
  tag: string
  sort: string
  tags: string[]
  onFilterChange: (key: string, value: string | null) => void
  onClear: () => void
}

export function MobileProjectFilters({
  open,
  onOpenChange,
  activeCount,
  tag,
  sort,
  tags,
  onFilterChange,
  onClear,
}: MobileProjectFiltersProps) {
  return (
    <FilterMobileDrawer
      open={open}
      onOpenChange={onOpenChange}
      activeCount={activeCount}
      description="Refine the projects shown"
      onClear={onClear}
    >
      <FilterField label="Tag">
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
      </FilterField>

      <FilterField label="Sort by">
        <Select value={sort || "createdAt"} onValueChange={(v) => onFilterChange("sort", v)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Newest first</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="progress">Progress</SelectItem>
          </SelectContent>
        </Select>
      </FilterField>
    </FilterMobileDrawer>
  )
}
