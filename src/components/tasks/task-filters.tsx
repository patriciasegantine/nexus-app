'use client'

import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ActiveTaskFilters } from "@/components/tasks/active-task-filters"
import { DesktopTaskFilters } from "@/components/tasks/desktop-task-filters"
import { MobileTaskFilters } from "@/components/tasks/mobile-task-filters"
import type { Project } from "@/types/project"

interface TaskFiltersProps {
  projects: Project[]
  tags: string[]
}

export function TaskFilters({ projects, tags }: TaskFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentSearch = searchParams.get('search') ?? ''
  const currentStatus = searchParams.get('status') ?? ''
  const currentPriority = searchParams.get('priority') ?? ''
  const currentProject = searchParams.get('projectId') ?? ''
  const currentDueDate = searchParams.get('dueDate') ?? ''
  const currentDueDateExact = searchParams.get('dueDateExact') ?? ''
  const currentTag = searchParams.get('tag') ?? ''

  const [searchValue, setSearchValue] = useState(currentSearch)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setSearchValue(currentSearch)
  }, [currentSearch])

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (key === 'dueDate' && value) params.delete('dueDateExact')
    if (key === 'dueDateExact' && value) params.delete('dueDate')
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page')
    router.replace(`${pathname}?${params.toString()}`)
  }

  function handleSearchChange(value: string) {
    setSearchValue(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      updateParam('search', value || null)
    }, 300)
  }

  function handleClearAll() {
    router.replace(pathname)
    setSearchValue('')
  }

  function handleClearMobileFilters() {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('status')
    params.delete('priority')
    params.delete('projectId')
    params.delete('dueDate')
    params.delete('dueDateExact')
    params.delete('tag')
    params.delete('page')
    router.replace(params.size > 0 ? `${pathname}?${params.toString()}` : pathname)
  }

  const activeCount = [currentStatus, currentPriority, currentProject, currentDueDate, currentDueDateExact, currentTag].filter(Boolean).length
  const hasAnyFilter = Boolean(currentSearch || activeCount)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search tasks..."
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="border-border/90 bg-card pl-9 shadow-sm"
          />
        </div>

        <MobileTaskFilters
          open={mobileFiltersOpen}
          onOpenChange={setMobileFiltersOpen}
          activeCount={activeCount}
          status={currentStatus}
          priority={currentPriority}
          projectId={currentProject}
          dueDate={currentDueDate}
          tag={currentTag}
          projects={projects}
          tags={tags}
          onFilterChange={updateParam}
          onClear={handleClearMobileFilters}
        />

        <DesktopTaskFilters
          status={currentStatus}
          priority={currentPriority}
          projectId={currentProject}
          dueDate={currentDueDate}
          tag={currentTag}
          projects={projects}
          tags={tags}
          activeCount={activeCount}
          hasAnyFilter={hasAnyFilter}
          onFilterChange={updateParam}
          onClear={handleClearAll}
        />
      </div>

      <ActiveTaskFilters
        status={currentStatus}
        priority={currentPriority}
        projectId={currentProject}
        dueDate={currentDueDate}
        dueDateExact={currentDueDateExact}
        tag={currentTag}
        projects={projects}
        onRemove={(key) => updateParam(key, null)}
      />
    </div>
  )
}
