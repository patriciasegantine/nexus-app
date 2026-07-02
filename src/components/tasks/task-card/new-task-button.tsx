'use client'

import { useState } from "react"
import { Plus } from "lucide-react"
import { PageHeaderAction } from "@/components/ui/page-header"
import { TaskDialog } from "../task-dialog/task-dialog"

interface NewTaskButtonProps {
  iconOnlyOnMobile?: boolean
}

export function NewTaskButton({ iconOnlyOnMobile = false }: NewTaskButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <PageHeaderAction
        icon={Plus}
        iconOnlyOnMobile={iconOnlyOnMobile}
        onClick={() => setOpen(true)}
        aria-label="New task"
      >
        New task
      </PageHeaderAction>
      <TaskDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
