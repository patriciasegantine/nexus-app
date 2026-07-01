import { getBoardData, getProjectTags } from "@/lib/data/projects"
import { NewProjectButton } from "@/components/projects/new-project-button"
import { PageHeader } from "@/components/ui/page-header"
import { ProjectsPageClient } from "@/components/projects/projects-page-client"
import { getStringParam, getValidatedParam, type SearchParams } from "@/lib/search-params"

const VALID_SORTS = new Set(["name", "progress", "createdAt"] as const)

interface ProjectsPageProps {
  searchParams: Promise<SearchParams>
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const params = await searchParams
  const search = getStringParam(params, "search")
  const tag = getStringParam(params, "tag")
  const validSort = getValidatedParam(params, "sort", VALID_SORTS) ?? "createdAt"

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
