/** @jest-environment node */
import { duplicateTask } from "@/actions/tasks"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { DEMO_ERROR } from "@/lib/demo-guard"

jest.mock("@/auth", () => ({
  auth: jest.fn(),
}))

jest.mock("@/lib/db", () => ({
  db: {
    task: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}))

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}))

const mockAuth = auth as jest.Mock
const mockFindUnique = db.task.findUnique as jest.Mock
const mockCreate = db.task.create as jest.Mock

const existingTask = {
  title: "Write tests",
  description: "Cover the critical actions",
  priority: "HIGH",
  status: "TODO",
  tags: ["testing"],
  projectId: "project-1",
  dueDate: new Date("2026-08-01"),
}

describe("duplicateTask", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("duplicates a user-owned task with a (copy) suffix", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } })
    mockFindUnique.mockResolvedValue(existingTask)
    mockCreate.mockResolvedValue({ id: "task-2" })

    const result = await duplicateTask("task-1")

    expect(result).toEqual({ success: true, data: { id: "task-2" } })
    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        title: "Write tests (copy)",
        description: existingTask.description,
        priority: existingTask.priority,
        status: existingTask.status,
        tags: existingTask.tags,
        projectId: existingTask.projectId,
        userId: "user-1",
        dueDate: existingTask.dueDate,
      },
      select: { id: true },
    })
    expect(revalidatePath).toHaveBeenCalled()
  })

  it("does not reveal tasks owned by another user", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } })
    mockFindUnique.mockResolvedValue(null)

    const result = await duplicateTask("task-2")

    expect(result).toEqual({ success: false, error: "Task not found" })
    expect(mockCreate).not.toHaveBeenCalled()
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it("requires an authenticated user", async () => {
    mockAuth.mockResolvedValue(null)

    const result = await duplicateTask("task-1")

    expect(result).toEqual({ success: false, error: "Unauthorized" })
    expect(mockFindUnique).not.toHaveBeenCalled()
  })

  it("prevents the demo user from duplicating tasks", async () => {
    const previousDemoEmail = process.env.DEMO_USER_EMAIL
    process.env.DEMO_USER_EMAIL = "demo@nexus.local"
    mockAuth.mockResolvedValue({
      user: { id: "demo-user", email: "demo@nexus.local" },
    })

    try {
      const result = await duplicateTask("task-1")

      expect(result).toEqual({ success: false, error: DEMO_ERROR })
      expect(mockFindUnique).not.toHaveBeenCalled()
      expect(mockCreate).not.toHaveBeenCalled()
      expect(revalidatePath).not.toHaveBeenCalled()
    } finally {
      if (previousDemoEmail === undefined) delete process.env.DEMO_USER_EMAIL
      else process.env.DEMO_USER_EMAIL = previousDemoEmail
    }
  })
})
