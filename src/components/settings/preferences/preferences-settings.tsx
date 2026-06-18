"use client"

import { useEffect, useState } from "react"
import {
  DEFAULT_TASK_PAGE_SIZE,
  DEFAULT_TASK_SORT,
  TASK_PAGE_SIZE_OPTIONS,
  TASK_PAGE_SIZE_PREFERENCE_KEY,
  TASK_SORT_OPTIONS,
  TASK_SORT_PREFERENCE_KEY,
  isTaskPageSizeOption,
} from "@/constants/preferences"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import type { TaskSortOption } from "@/lib/data/tasks"

export function PreferencesSettings() {
  const [defaultSort, setDefaultSort] = useState<TaskSortOption>(DEFAULT_TASK_SORT)
  const [pageSize, setPageSize] = useState(String(DEFAULT_TASK_PAGE_SIZE))

  useEffect(() => {
    const storedSort = window.localStorage.getItem(TASK_SORT_PREFERENCE_KEY)
    const storedPageSize = Number(window.localStorage.getItem(TASK_PAGE_SIZE_PREFERENCE_KEY))

    if (TASK_SORT_OPTIONS.some((option) => option.value === storedSort)) {
      setDefaultSort(storedSort as TaskSortOption)
    }

    if (isTaskPageSizeOption(storedPageSize)) {
      setPageSize(String(storedPageSize))
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

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Preferences</h2>
        <p className="text-sm text-muted-foreground">Choose your default task view.</p>
      </div>

      <div className="grid max-w-xl gap-4 sm:grid-cols-2">
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
    </div>
  )
}
