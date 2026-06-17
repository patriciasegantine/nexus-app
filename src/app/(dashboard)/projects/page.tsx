import { getBoardData, getProjectTags } from "@/lib/data/projects"
import { NewProjectButton } from "@/components/projects/new-project-button"
import { PageHeader } from "@/components/ui/page-header"
import { ProjectsPageClient } from "@/components/projects/projects-page-client"

interface ProjectsPageProps {
  searchParams: Promise<{ search?: string; tag?: string; sort?: string }>
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const { search, tag, sort } = await searchParams

  const validSort = sort === "name" || sort === "progress" ? sort : "createdAt"

  const [projects, tags] = await Promise.all([
    getBoardData({ search, tag, sort: validSort }),
    getProjectTags(),
  ])

  const hasFilters = Boolean(search || tag)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Manage your projects"
        action={<NewProjectButton iconOnlyOnMobile />}
      />

      <ProjectsPageClient
        projects={projects}
        tags={tags}
        hasFilters={hasFilters}
      />
    </div>
  )
}
