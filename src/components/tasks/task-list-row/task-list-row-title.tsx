interface TaskListRowTitleProps {
  title: string
  project?: { name: string } | null
}

export function TaskListRowTitle({ title, project }: TaskListRowTitleProps) {
  return (
    <>
      <p className="font-semibold text-sm leading-tight text-foreground line-clamp-2 sm:line-clamp-1">
        {title}
      </p>
      {project && (
        <p className="text-xs text-muted-foreground/60 truncate mt-0.5">{project.name}</p>
      )}
    </>
  )
}
