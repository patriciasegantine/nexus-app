"use client"

import { useEffect, useState } from "react"
import { LayoutGrid, List } from "lucide-react"
import {
  DEFAULT_TASK_PAGE_SIZE,
  DEFAULT_TASK_SORT,
  DEFAULT_TASK_VIEW,
  TASK_PAGE_SIZE_OPTIONS,
  TASK_PAGE_SIZE_PREFERENCE_KEY,
  TASK_SORT_OPTIONS,
  TASK_SORT_PREFERENCE_KEY,
  TASK_VIEW_PREFERENCE_KEY,
  TaskViewOption,
  isTaskPageSizeOption,
} from "@/constants/preferences"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { SettingsSection } from "@/components/settings/settings-section"
import { cn } from "@/lib/utils"
import type { TaskSortOption } from "@/lib/data/tasks"

const VIEW_OPTIONS = [
  { value: "cards" as TaskViewOption, label: "Cards", icon: LayoutGrid },
  { value: "list" as TaskViewOption, label: "List", icon: List },
]

export function PreferencesSettings() {
  const [defaultSort, setDefaultSort] = useState<TaskSortOption>(DEFAULT_TASK_SORT)
  const [pageSize, setPageSize] = useState(String(DEFAULT_TASK_PAGE_SIZE))
  const [taskView, setTaskView] = useState<TaskViewOption>(DEFAULT_TASK_VIEW)

  useEffect(() => {
    const storedSort = window.localStorage.getItem(TASK_SORT_PREFERENCE_KEY)
    const storedPageSize = Number(window.localStorage.getItem(TASK_PAGE_SIZE_PREFERENCE_KEY))
    const storedView = window.localStorage.getItem(TASK_VIEW_PREFERENCE_KEY)

    if (TASK_SORT_OPTIONS.some((option) => option.value === storedSort)) {
      setDefaultSort(storedSort as TaskSortOption)
    }

    if (isTaskPageSizeOption(storedPageSize)) {
      setPageSize(String(storedPageSize))
    }

    if (storedView === "cards" || storedView === "list") {
      setTaskView(storedView)
    }
  }, [])

  function handleSortChange(value: TaskSortOption) {
    setDefaultSort(value)
    window.localStorage.setItem(TASK_SORT_PREFERENCE_KEY, value)
  }

  function handlePageSizeChange(value: string) {
    const nextPageSize = Number(value)
    if (!isTaskPageSizeOption(nextPageSize)) return

    setPageSize(value)
    window.localStorage.setItem(TASK_PAGE_SIZE_PREFERENCE_KEY, value)
  }

  function handleViewChange(value: TaskViewOption) {
    setTaskView(value)
    window.localStorage.setItem(TASK_VIEW_PREFERENCE_KEY, value)
  }

  return (
    <SettingsSection title="Preferences" description="Choose your default task view.">
      <div className="flex flex-col gap-6 max-w-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="default-task-sort">Default task sort</Label>
            <Select value={defaultSort} onValueChange={handleSortChange}>
              <SelectTrigger id="default-task-sort" className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TASK_SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="task-page-size">Tasks per page</Label>
            <Select value={pageSize} onValueChange={handlePageSizeChange}>
              <SelectTrigger id="task-page-size" className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TASK_PAGE_SIZE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={String(option)}>
                    {option} tasks
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1">
          <Label>Default task layout</Label>
          <div className="flex gap-3">
            {VIEW_OPTIONS.map(({ value, label, icon: Icon }) => (
              <Button
                key={value}
                variant="outline"
                className={cn(
                  "flex flex-col items-center gap-2 h-auto py-3 px-5",
                  taskView === value && "border-foreground bg-muted"
                )}
                onClick={() => handleViewChange(value)}
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs">{label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </SettingsSection>
  )
}
