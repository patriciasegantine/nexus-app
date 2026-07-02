import { ArrowUpDown, Grid2X2, List, SlidersHorizontal, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  DueDateFilterField,
  PriorityFilterField,
  ProjectFilterField,
  StatusFilterField,
  TagFilterField,
} from "@/components/tasks/filters/task-filter-fields"
import type { Project } from "@/types/project"
import type { TaskViewOption } from "@/constants/preferences"

const SORT_OPTIONS = [
  { value: "updatedAt", label: "Recently updated" },
  { value: "dueDate", label: "Due date" },
  { value: "title", label: "Title A–Z" },
]

interface DesktopTaskFiltersProps {
  status: string
  priority: string
  projectId: string
  dueDate: string
  tag: string
  sort: string
  projects: Project[]
  tags: string[]
  activeCount: number
  hasAnyFilter: boolean
  view: TaskViewOption
  onFilterChange: (key: string, value: string | null) => void
  onViewChange: (view: TaskViewOption) => void
  onClear: () => void
}

export function DesktopTaskFilters({
  status,
  priority,
  projectId,
  dueDate,
  tag,
  sort,
  projects,
  tags,
  activeCount,
  hasAnyFilter,
  view,
  onFilterChange,
  onViewChange,
  onClear,
}: DesktopTaskFiltersProps) {
  return (
    <>
      <div className="hidden items-center gap-2 md:flex">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-10 shrink-0 gap-2 border-border/90 bg-card px-4 shadow-sm">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeCount > 0 && (
                <Badge variant="secondary" className="h-5 px-1.5 text-xs">{activeCount}</Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 space-y-4 p-4" align="end">
            <div className="space-y-1.5">
              <p className="text-sm font-medium">Status</p>
              <StatusFilterField value={status} onChange={(v) => onFilterChange("status", v)} className="w-full" />
            </div>
            <div className="space-y-1.5">
              <p className="text-sm font-medium">Priority</p>
              <PriorityFilterField value={priority} onChange={(v) => onFilterChange("priority", v)} className="w-full" />
            </div>
            <div className="space-y-1.5">
              <p className="text-sm font-medium">Project</p>
              <ProjectFilterField value={projectId} onChange={(v) => onFilterChange("projectId", v)} projects={projects} className="w-full" />
            </div>
            <div className="space-y-1.5">
              <p className="text-sm font-medium">Due date</p>
              <DueDateFilterField value={dueDate} onChange={(v) => onFilterChange("dueDate", v)} className="w-full" />
            </div>
            <div className="space-y-1.5">
              <p className="text-sm font-medium">Tag</p>
              <TagFilterField value={tag} onChange={(v) => onFilterChange("tag", v)} tags={tags} className="w-full" />
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-10 shrink-0 gap-2 border-border/90 bg-card px-4 shadow-sm">
              <ArrowUpDown className="h-4 w-4" />
              Sort
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2" align="end">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => onFilterChange("sort", option.value === "updatedAt" ? null : option.value)}
                className={`w-full text-left px-3 py-1.5 rounded-sm text-sm hover:bg-muted transition-colors ${
                  sort === option.value || (option.value === "updatedAt" && !sort)
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                }`}
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
            onClick={() => onViewChange("cards")}
            className={`rounded p-1.5 transition-colors ${view === "cards" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Grid2X2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="List view"
            onClick={() => onViewChange("list")}
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
    </>
  )
}
