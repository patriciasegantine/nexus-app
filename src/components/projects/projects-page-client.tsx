'use client'

import { Suspense } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { AlertTriangle, CheckCircle2, FolderKanban, PlayCircle } from "lucide-react"
import { ProjectCard } from "@/components/projects/project-card/project-card"
import { ProjectFilters } from "@/components/projects/filters/project-filters"
import { ProjectListRow } from "@/components/projects/project-list-row"
import { EmptyState } from "@/components/ui/empty-state"
import { SummaryMetric } from "@/components/ui/summary-metric"
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
  const currentView = searchParams.get("view") === "cards" ? "cards" : "list"

  const activeProjects = projects.filter((project) => project.status === "ACTIVE").length
  const completedProjects = projects.filter((project) => project.status === "COMPLETED").length
  const overdueTasks = projects.reduce((total, project) => total + project.overdue, 0)
  const averageProgress =
    projects.length > 0
      ? Math.round(projects.reduce((total, project) => total + project.progress, 0) / projects.length)
      : 0

  function handleTagClick(tag: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("tag", tag)
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-2.5 sm:gap-4">
        <SummaryMetric icon={FolderKanban} label="Projects" value={projects.length} />
        <SummaryMetric icon={PlayCircle} label="Active" value={activeProjects} />
        <SummaryMetric icon={AlertTriangle} label="Overdue tasks" value={overdueTasks} tone={overdueTasks > 0 ? "danger" : "default"} />
        <SummaryMetric icon={CheckCircle2} label="Avg progress" value={`${averageProgress}%`} />
      </div>

      <div className="space-y-3">
        <Suspense>
          <ProjectFilters tags={tags} />
        </Suspense>

        <div className="border-t border-border/60 pt-4">
          {projects.length > 0 ? (
            <p className="text-sm text-muted-foreground">
              {projects.length} {projects.length === 1 ? "project" : "projects"}
              {completedProjects > 0 && (
                <span className="ml-2 text-muted-foreground/80">{completedProjects} completed</span>
              )}
            </p>
          ) : (
            <span />
          )}
        </div>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title={hasFilters ? "No projects match your filters." : "No projects yet. Create your first one."}
          action={!hasFilters && <NewProjectButton />}
          className="py-24"
        />
      ) : (
        <>
          {/* Mobile always shows cards; the list view is desktop-only. */}
          <div className="grid gap-4 md:hidden">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} onTagClick={handleTagClick} />
            ))}
          </div>

          <div className="hidden md:block">
            {currentView === "cards" ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} onTagClick={handleTagClick} />
                ))}
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
                <div className="hidden grid-cols-[minmax(280px,1.8fr)_120px_112px_minmax(160px,0.8fr)_minmax(180px,0.9fr)_96px_40px] gap-4 border-b border-border/70 bg-muted/40 px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-muted-foreground lg:grid">
                  <span>Project</span>
                  <span>Status</span>
                  <span>Priority</span>
                  <span>Timeline</span>
                  <span>Progress</span>
                  <span className="text-right">Tasks</span>
                  <span />
                </div>
                <div className="overflow-x-auto">
                  <div className="min-w-[1040px]">
                    {projects.map((project) => (
                      <ProjectListRow key={project.id} project={project} onTagClick={handleTagClick} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
