'use client'

import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ActiveProjectFilters } from "./active-project-filters"
import { DesktopProjectFilters } from "./desktop-project-filters"
import { MobileProjectFilters } from "./mobile-project-filters"

interface ProjectFiltersProps {
  tags: string[]
}

export function ProjectFilters({ tags }: ProjectFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentSearch = searchParams.get("search") ?? ""
  const currentTag = searchParams.get("tag") ?? ""
  const currentSort = searchParams.get("sort") ?? "createdAt"
  const currentView = searchParams.get("view") === "cards" ? "cards" : "list"

  const [searchValue, setSearchValue] = useState(currentSearch)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setSearchValue(currentSearch)
  }, [currentSearch])

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.replace(`${pathname}?${params.toString()}`)
  }

  function handleSearchChange(value: string) {
    setSearchValue(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      updateParam("search", value || null)
    }, 300)
  }

  function handleClearAll() {
    const params = new URLSearchParams()
    const view = searchParams.get("view")
    if (view) params.set("view", view)
    router.replace(params.size > 0 ? `${pathname}?${params.toString()}` : pathname)
    setSearchValue("")
  }

  function handleClearMobileFilters() {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("tag")
    params.delete("sort")
    router.replace(params.size > 0 ? `${pathname}?${params.toString()}` : pathname)
  }

  const activeCount = [currentTag].filter(Boolean).length
  const hasAnyFilter = Boolean(currentSearch || activeCount)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search projects..."
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="border-border/90 bg-card pl-9 shadow-sm"
          />
        </div>

        <MobileProjectFilters
          open={mobileFiltersOpen}
          onOpenChange={setMobileFiltersOpen}
          activeCount={activeCount}
          tag={currentTag}
          sort={currentSort}
          tags={tags}
          onFilterChange={updateParam}
          onClear={handleClearMobileFilters}
        />

        <DesktopProjectFilters
          tag={currentTag}
          sort={currentSort}
          tags={tags}
          activeCount={activeCount}
          hasAnyFilter={hasAnyFilter}
          view={currentView}
          onFilterChange={updateParam}
          onClear={handleClearAll}
        />
      </div>

      <ActiveProjectFilters
        tag={currentTag}
        onRemove={(key) => updateParam(key, null)}
      />
    </div>
  )
}
