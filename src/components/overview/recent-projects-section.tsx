import { Rocket } from "lucide-react"
import { getRecentProjectsForDashboard } from '@/lib/data/dashboard'
import { RecentProjects } from './recent-projects'
import { NewProjectButton } from '@/components/projects/new-project-button'
import { SampleDataButton } from '@/components/overview/sample-data-button'

export async function RecentProjectsSection() {
  const projects = await getRecentProjectsForDashboard()
  const hasNoProjects = projects.length === 0

  return (
    <>
      {hasNoProjects && (
        <div className="rounded-lg border bg-card p-8 flex flex-col items-center justify-center text-center gap-4">
          <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
            <Rocket className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="font-medium">Welcome to Nexus!</p>
            <p className="text-sm text-muted-foreground mt-1">
              Create your first project to start tracking tasks and see your progress here.
            </p>
          </div>
          <div className="flex gap-2">
            <NewProjectButton />
            <SampleDataButton />
          </div>
        </div>
      )}

      <RecentProjects projects={projects} />
    </>
  )
}
