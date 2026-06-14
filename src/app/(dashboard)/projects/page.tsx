import { getBoardData } from "@/lib/data/projects"
import { ProjectCard } from "@/components/projects/project-card"
import { NewProjectButton } from "@/components/projects/new-project-button"
import { PageHeader } from "@/components/ui/page-header"
import { EmptyState } from "@/components/ui/empty-state"
import { FolderKanban } from "lucide-react"

export default async function ProjectsPage() {
  const projects = await getBoardData()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Manage your projects"
        action={<NewProjectButton iconOnlyOnMobile />}
      />

      {projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet. Create your first one."
          action={<NewProjectButton />}
          className="py-24"
        />
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
