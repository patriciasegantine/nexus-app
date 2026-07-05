/** @jest-environment node */
import { deleteTask } from "@/actions/tasks"
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
      delete: jest.fn(),
    },
  },
}))

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}))

const mockAuth = auth as jest.Mock
const mockFindUnique = db.task.findUnique as jest.Mock
const mockDelete = db.task.delete as jest.Mock

describe("deleteTask", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("deletes a user-owned task", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } })
    mockFindUnique.mockResolvedValue({ id: "task-1" })
    mockDelete.mockResolvedValue({})

    const result = await deleteTask("task-1")

    expect(result).toEqual({ success: true, data: undefined })
    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: "task-1", userId: "user-1" },
      select: { id: true },
    })
    expect(mockDelete).toHaveBeenCalledWith({
      where: { id: "task-1", userId: "user-1" },
    })
    expect(revalidatePath).toHaveBeenCalled()
  })

  it("does not reveal tasks owned by another user", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } })
    mockFindUnique.mockResolvedValue(null)

    const result = await deleteTask("task-2")

    expect(result).toEqual({ success: false, error: "Task not found" })
    expect(mockDelete).not.toHaveBeenCalled()
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it("requires an authenticated user", async () => {
    mockAuth.mockResolvedValue(null)

    const result = await deleteTask("task-1")

    expect(result).toEqual({ success: false, error: "Unauthorized" })
    expect(mockFindUnique).not.toHaveBeenCalled()
  })

  it("prevents the demo user from deleting tasks", async () => {
    const previousDemoEmail = process.env.DEMO_USER_EMAIL
    process.env.DEMO_USER_EMAIL = "demo@nexus.local"
    mockAuth.mockResolvedValue({
      user: { id: "demo-user", email: "demo@nexus.local" },
    })

    try {
      const result = await deleteTask("task-1")

      expect(result).toEqual({ success: false, error: DEMO_ERROR })
      expect(mockFindUnique).not.toHaveBeenCalled()
      expect(mockDelete).not.toHaveBeenCalled()
      expect(revalidatePath).not.toHaveBeenCalled()
    } finally {
      if (previousDemoEmail === undefined) delete process.env.DEMO_USER_EMAIL
      else process.env.DEMO_USER_EMAIL = previousDemoEmail
    }
  })
})
