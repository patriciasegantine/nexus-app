/** @jest-environment node */
import { createTask } from "@/actions/tasks"
import { auth } from "@/auth"
import { AppRoutes } from "@/constants/routes"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { DEMO_ERROR } from "@/lib/demo-guard"

jest.mock("@/auth", () => ({
  auth: jest.fn(),
}))

jest.mock("@/lib/db", () => ({
  db: {
    project: {
      findUnique: jest.fn(),
    },
    task: {
      create: jest.fn(),
    },
  },
}))

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}))

const mockAuth = auth as jest.Mock
const mockProjectFindUnique = db.project.findUnique as jest.Mock
const mockTaskCreate = db.task.create as jest.Mock

function taskFormData(overrides: Partial<Record<"title" | "description" | "priority" | "status" | "tags" | "projectId" | "dueDate", string>> = {}) {
  const formData = new FormData()
  formData.set("title", overrides.title ?? "Write tests")
  formData.set("description", overrides.description ?? "Cover the critical actions")
  formData.set("priority", overrides.priority ?? "HIGH")
  formData.set("status", overrides.status ?? "TODO")
  formData.set("tags", overrides.tags ?? JSON.stringify(["testing"]))
  formData.set("projectId", overrides.projectId ?? "project-1")
  if (overrides.dueDate) formData.set("dueDate", overrides.dueDate)
  return formData
}

describe("createTask", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("creates a task under a project owned by the user", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } })
    mockProjectFindUnique.mockResolvedValue({ id: "project-1" })
    mockTaskCreate.mockResolvedValue({ id: "task-1" })

    const result = await createTask(taskFormData())

    expect(result).toEqual({ success: true, data: { id: "task-1" } })
    expect(mockProjectFindUnique).toHaveBeenCalledWith({
      where: { id: "project-1", userId: "user-1" },
      select: { id: true },
    })
    expect(mockTaskCreate).toHaveBeenCalledWith({
      data: {
        title: "Write tests",
        description: "Cover the critical actions",
        priority: "HIGH",
        status: "TODO",
        tags: ["testing"],
        projectId: "project-1",
        userId: "user-1",
        dueDate: undefined,
      },
      select: { id: true },
    })
    expect(revalidatePath).toHaveBeenCalledWith(AppRoutes.DASHBOARD.PROJECTS)
  })

  it("rejects creating a task under a project not owned by the user", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } })
    mockProjectFindUnique.mockResolvedValue(null)

    const result = await createTask(taskFormData({ projectId: "someone-elses-project" }))

    expect(result).toEqual({ success: false, error: "Project not found" })
    expect(mockTaskCreate).not.toHaveBeenCalled()
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it("rejects invalid input before touching the database", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } })

    const result = await createTask(taskFormData({ title: "" }))

    expect(result.success).toBe(false)
    expect(mockProjectFindUnique).not.toHaveBeenCalled()
    expect(mockTaskCreate).not.toHaveBeenCalled()
  })

  it("requires an authenticated user", async () => {
    mockAuth.mockResolvedValue(null)

    const result = await createTask(taskFormData())

    expect(result).toEqual({ success: false, error: "Unauthorized" })
    expect(mockTaskCreate).not.toHaveBeenCalled()
  })

  it("prevents the demo user from creating tasks", async () => {
    const previousDemoEmail = process.env.DEMO_USER_EMAIL
    process.env.DEMO_USER_EMAIL = "demo@nexus.local"
    mockAuth.mockResolvedValue({
      user: { id: "demo-user", email: "demo@nexus.local" },
    })

    try {
      const result = await createTask(taskFormData())

      expect(result).toEqual({ success: false, error: DEMO_ERROR })
      expect(mockProjectFindUnique).not.toHaveBeenCalled()
      expect(mockTaskCreate).not.toHaveBeenCalled()
      expect(revalidatePath).not.toHaveBeenCalled()
    } finally {
      if (previousDemoEmail === undefined) delete process.env.DEMO_USER_EMAIL
      else process.env.DEMO_USER_EMAIL = previousDemoEmail
    }
  })
})
