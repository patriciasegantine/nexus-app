/** @jest-environment node */
import { removeTaskTag } from "@/actions/tasks"
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
      update: jest.fn(),
    },
  },
}))

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}))

const mockAuth = auth as jest.Mock
const mockFindUnique = db.task.findUnique as jest.Mock
const mockUpdate = db.task.update as jest.Mock

describe("removeTaskTag", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("removes an existing tag from a user-owned task", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } })
    mockFindUnique.mockResolvedValue({ tags: ["design", "frontend", "ux"] })
    mockUpdate.mockResolvedValue({})

    const result = await removeTaskTag("task-1", "frontend")

    expect(result).toEqual({ success: true, data: ["design", "ux"] })
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "task-1", userId: "user-1" },
      data: { tags: ["design", "ux"] },
    })
    expect(revalidatePath).toHaveBeenCalled()
  })

  it("is a no-op when the tag does not match exactly (no normalization)", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } })
    mockFindUnique.mockResolvedValue({ tags: ["frontend"] })
    mockUpdate.mockResolvedValue({})

    const result = await removeTaskTag("task-1", " Frontend ")

    expect(result).toEqual({ success: true, data: ["frontend"] })
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "task-1", userId: "user-1" },
      data: { tags: ["frontend"] },
    })
  })

  it("does not reveal tasks owned by another user", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } })
    mockFindUnique.mockResolvedValue(null)

    const result = await removeTaskTag("task-2", "frontend")

    expect(result).toEqual({ success: false, error: "Task not found" })
    expect(mockUpdate).not.toHaveBeenCalled()
  })

  it("requires an authenticated user", async () => {
    mockAuth.mockResolvedValue(null)

    const result = await removeTaskTag("task-1", "frontend")

    expect(result).toEqual({ success: false, error: "Unauthorized" })
    expect(mockFindUnique).not.toHaveBeenCalled()
  })

  it("prevents the demo user from removing tags", async () => {
    const previousDemoEmail = process.env.DEMO_USER_EMAIL
    process.env.DEMO_USER_EMAIL = "demo@nexus.local"
    mockAuth.mockResolvedValue({
      user: { id: "demo-user", email: "demo@nexus.local" },
    })

    try {
      const result = await removeTaskTag("task-1", "frontend")

      expect(result).toEqual({ success: false, error: DEMO_ERROR })
      expect(mockFindUnique).not.toHaveBeenCalled()
    } finally {
      if (previousDemoEmail === undefined) delete process.env.DEMO_USER_EMAIL
      else process.env.DEMO_USER_EMAIL = previousDemoEmail
    }
  })
})
