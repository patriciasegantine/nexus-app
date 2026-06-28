import Link from "next/link"
import { AppRoutes } from "@/constants/routes"

interface TaskCardProjectProps {
  project: { name: string; slug?: string }
}

export function TaskCardProject({ project }: TaskCardProjectProps) {
  if (project.slug) {
    return (
      <Link
        href={`${AppRoutes.DASHBOARD.PROJECTS}/${project.slug}`}
        className="text-xs text-muted-foreground/80 truncate hover:text-foreground transition-colors w-fit"
        onClick={(e) => e.stopPropagation()}
      >
        {project.name}
      </Link>
    )
  }

  return (
    <p className="text-xs text-muted-foreground/80 truncate">{project.name}</p>
  )
}
