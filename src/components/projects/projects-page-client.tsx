'use client'

import { Suspense } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { FolderKanban } from "lucide-react"
import { ProjectCard } from "@/components/projects/project-card/project-card"
import { ProjectFilters } from "@/components/projects/filters/project-filters"
import { EmptyState } from "@/components/ui/empty-state"
import { NewProjectButton } from "@/components/projects/new-project-button"
import type { ProjectBoardItem } from "@/types/project"

interface ProjectsPageClientProps {
  projects: ProjectBoardItem[]
  tags: string[]
  hasFilters: boolean
}

export function ProjectsPageClient({ projects, tags, hasFilters }: ProjectsPageClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function handleTagClick(tag: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("tag", tag)
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="space-y-4">
      <Suspense>
        <ProjectFilters tags={tags} />
      </Suspense>

      <hr className="border-border/60" />

      {projects.length > 0 && (
        <p className="text-sm text-muted-foreground">
          {projects.length} {projects.length === 1 ? "project" : "projects"}
        </p>
      )}

      {projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title={hasFilters ? "No projects match your filters." : "No projects yet. Create your first one."}
          action={!hasFilters && <NewProjectButton />}
          className="py-24"
        />
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onTagClick={handleTagClick} />
          ))}
        </div>
      )}
    </div>
  )
}
