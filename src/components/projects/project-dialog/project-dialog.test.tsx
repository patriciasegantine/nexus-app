import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import type { ReactNode } from "react"
import { ProjectDialog } from "@/components/projects/project-dialog/project-dialog"
import { createProject, updateProject } from "@/actions/projects"
import { DEMO_ERROR } from "@/lib/demo-guard"

const mockToast = jest.fn()

jest.mock("@/actions/projects", () => ({
  createProject: jest.fn(),
  updateProject: jest.fn(),
}))

jest.mock("@/hooks/use-toast", () => ({
  toast: (options: unknown) => mockToast(options),
}))

jest.mock("@/components/ui/dialog", () => ({
  Dialog: ({ open, children }: { open: boolean; children: ReactNode }) =>
    open ? <div role="dialog">{children}</div> : null,
  DialogContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DialogFooter: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DialogHeader: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: ReactNode }) => <h2>{children}</h2>,
}))

describe("ProjectDialog", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("shows server action errors in a destructive toast", async () => {
    ;(createProject as jest.Mock).mockResolvedValue({ success: false, error: DEMO_ERROR })
    const onOpenChange = jest.fn()

    render(<ProjectDialog open onOpenChange={onOpenChange} />)

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Portfolio project" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Create project" }))

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: "destructive",
        description: DEMO_ERROR,
      })
    })
    expect(onOpenChange).not.toHaveBeenCalledWith(false)
    expect(updateProject).not.toHaveBeenCalled()
  })
})
