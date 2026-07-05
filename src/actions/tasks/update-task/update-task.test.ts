/** @jest-environment node */
import { updateTask, updateTaskStatus } from "@/actions/tasks"
import { auth } from "@/auth"
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
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}))

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}))

const mockAuth = auth as jest.Mock
const mockProjectFindUnique = db.project.findUnique as jest.Mock
const mockTaskFindUnique = db.task.findUnique as jest.Mock
const mockTaskUpdate = db.task.update as jest.Mock

function updateFormData(fields: Partial<Record<"title" | "description" | "priority" | "status" | "tags" | "projectId" | "dueDate", string>>) {
  const formData = new FormData()
  for (const [key, value] of Object.entries(fields)) {
    formData.set(key, value)
  }
  return formData
}

function statusFormData(status: string) {
  const formData = new FormData()
  formData.set("status", status)
  return formData
}

describe("updateTask", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("updates a user-owned task without changing its project", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } })
    mockTaskFindUnique.mockResolvedValue({ id: "task-1", projectId: "project-1" })
    mockTaskUpdate.mockResolvedValue({})

    const result = await updateTask("task-1", updateFormData({ title: "Updated title" }))

    expect(result).toEqual({ success: true, data: undefined })
    expect(mockProjectFindUnique).not.toHaveBeenCalled()
    expect(mockTaskUpdate).toHaveBeenCalledWith({
      where: { id: "task-1", userId: "user-1" },
      data: expect.objectContaining({ title: "Updated title" }),
    })
    expect(revalidatePath).toHaveBeenCalled()
  })

  it("moves a task to another project owned by the user", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } })
    mockTaskFindUnique.mockResolvedValue({ id: "task-1", projectId: "project-1" })
    mockProjectFindUnique.mockResolvedValue({ id: "project-2" })
    mockTaskUpdate.mockResolvedValue({})

    const result = await updateTask("task-1", updateFormData({ projectId: "project-2" }))

    expect(result.success).toBe(true)
    expect(mockProjectFindUnique).toHaveBeenCalledWith({
      where: { id: "project-2", userId: "user-1" },
      select: { id: true },
    })
    expect(mockTaskUpdate).toHaveBeenCalledWith({
      where: { id: "task-1", userId: "user-1" },
      data: expect.objectContaining({ projectId: "project-2" }),
    })
  })

  it("rejects moving a task to a project not owned by the user", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } })
    mockTaskFindUnique.mockResolvedValue({ id: "task-1", projectId: "project-1" })
    mockProjectFindUnique.mockResolvedValue(null)

    const result = await updateTask("task-1", updateFormData({ projectId: "someone-elses-project" }))

    expect(result).toEqual({ success: false, error: "Project not found" })
    expect(mockTaskUpdate).not.toHaveBeenCalled()
  })

  it("clears the due date when explicitly cleared", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } })
    mockTaskFindUnique.mockResolvedValue({ id: "task-1", projectId: "project-1" })
    mockTaskUpdate.mockResolvedValue({})

    const formData = new FormData()
    formData.set("dueDate", "")
    await updateTask("task-1", formData)

    expect(mockTaskUpdate).toHaveBeenCalledWith({
      where: { id: "task-1", userId: "user-1" },
      data: expect.objectContaining({ dueDate: null }),
    })
  })

  it("does not reveal tasks owned by another user", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } })
    mockTaskFindUnique.mockResolvedValue(null)

    const result = await updateTask("task-2", updateFormData({ title: "Updated title" }))

    expect(result).toEqual({ success: false, error: "Task not found" })
    expect(mockTaskUpdate).not.toHaveBeenCalled()
  })

  it("rejects invalid input before touching the database", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } })

    const result = await updateTask("task-1", updateFormData({ title: "a".repeat(201) }))

    expect(result.success).toBe(false)
    expect(mockTaskFindUnique).not.toHaveBeenCalled()
    expect(mockTaskUpdate).not.toHaveBeenCalled()
  })

  it("requires an authenticated user", async () => {
    mockAuth.mockResolvedValue(null)

    const result = await updateTask("task-1", updateFormData({ title: "Updated title" }))

    expect(result).toEqual({ success: false, error: "Unauthorized" })
    expect(mockTaskFindUnique).not.toHaveBeenCalled()
  })

  it("prevents the demo user from updating tasks", async () => {
    const previousDemoEmail = process.env.DEMO_USER_EMAIL
    process.env.DEMO_USER_EMAIL = "demo@nexus.local"
    mockAuth.mockResolvedValue({
      user: { id: "demo-user", email: "demo@nexus.local" },
    })

    try {
      const result = await updateTask("task-1", updateFormData({ title: "Updated title" }))

      expect(result).toEqual({ success: false, error: DEMO_ERROR })
      expect(mockTaskFindUnique).not.toHaveBeenCalled()
      expect(mockTaskUpdate).not.toHaveBeenCalled()
    } finally {
      if (previousDemoEmail === undefined) delete process.env.DEMO_USER_EMAIL
      else process.env.DEMO_USER_EMAIL = previousDemoEmail
    }
  })
})

describe("updateTaskStatus", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("updates the status of a user-owned task", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } })
    mockTaskFindUnique.mockResolvedValue({ id: "task-1" })
    mockTaskUpdate.mockResolvedValue({})

    const result = await updateTaskStatus("task-1", statusFormData("DONE"))

    expect(result).toEqual({ success: true, data: undefined })
    expect(mockTaskUpdate).toHaveBeenCalledWith({
      where: { id: "task-1", userId: "user-1" },
      data: { status: "DONE" },
    })
    expect(revalidatePath).toHaveBeenCalled()
  })

  it("reports success for the demo user without persisting or revalidating", async () => {
    const previousDemoEmail = process.env.DEMO_USER_EMAIL
    process.env.DEMO_USER_EMAIL = "demo@nexus.local"
    mockAuth.mockResolvedValue({
      user: { id: "demo-user", email: "demo@nexus.local" },
    })

    try {
      const result = await updateTaskStatus("task-1", statusFormData("DONE"))

      expect(result).toEqual({ success: true, data: undefined })
      expect(mockTaskFindUnique).not.toHaveBeenCalled()
      expect(mockTaskUpdate).not.toHaveBeenCalled()
      expect(revalidatePath).not.toHaveBeenCalled()
    } finally {
      if (previousDemoEmail === undefined) delete process.env.DEMO_USER_EMAIL
      else process.env.DEMO_USER_EMAIL = previousDemoEmail
    }
  })

  it("does not reveal tasks owned by another user", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } })
    mockTaskFindUnique.mockResolvedValue(null)

    const result = await updateTaskStatus("task-2", statusFormData("DONE"))

    expect(result).toEqual({ success: false, error: "Task not found" })
    expect(mockTaskUpdate).not.toHaveBeenCalled()
  })

  it("rejects an invalid status value", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } })

    const result = await updateTaskStatus("task-1", statusFormData("INVALID"))

    expect(result.success).toBe(false)
    expect(mockTaskFindUnique).not.toHaveBeenCalled()
    expect(mockTaskUpdate).not.toHaveBeenCalled()
  })

  it("requires an authenticated user", async () => {
    mockAuth.mockResolvedValue(null)

    const result = await updateTaskStatus("task-1", statusFormData("DONE"))

    expect(result).toEqual({ success: false, error: "Unauthorized" })
    expect(mockTaskUpdate).not.toHaveBeenCalled()
  })
})
