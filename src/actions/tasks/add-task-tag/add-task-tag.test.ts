/** @jest-environment node */
import { addTaskTag } from "@/actions/tasks"
import { auth } from "@/auth"
import { MAX_TAGS } from "@/constants/tags"
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

describe("addTaskTag", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("adds a normalized tag to a user-owned task", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } })
    mockFindUnique.mockResolvedValue({ tags: ["design"] })
    mockUpdate.mockResolvedValue({})

    const result = await addTaskTag("task-1", " Frontend ")

    expect(result).toEqual({ success: true, data: ["design", "frontend"] })
    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: "task-1", userId: "user-1" },
      select: { tags: true },
    })
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "task-1", userId: "user-1" },
      data: { tags: ["design", "frontend"] },
    })
    expect(revalidatePath).toHaveBeenCalled()
  })

  it("rejects an empty tag", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } })

    const result = await addTaskTag("task-1", "   ")

    expect(result).toEqual({ success: false, error: "Tag is required" })
    expect(mockFindUnique).not.toHaveBeenCalled()
  })

  it("rejects a tag longer than the maximum length", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } })

    const result = await addTaskTag("task-1", "a".repeat(31))

    expect(result.success).toBe(false)
    expect(mockFindUnique).not.toHaveBeenCalled()
  })

  it("rejects duplicate tags without updating", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } })
    mockFindUnique.mockResolvedValue({ tags: ["frontend"] })

    const result = await addTaskTag("task-1", "frontend")

    expect(result).toEqual({ success: false, error: "Tag already added" })
    expect(mockUpdate).not.toHaveBeenCalled()
  })

  it("rejects tags beyond the task tag limit", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } })
    mockFindUnique.mockResolvedValue({
      tags: Array.from({ length: MAX_TAGS }, (_, index) => `tag-${index}`),
    })

    const result = await addTaskTag("task-1", "extra")

    expect(result).toEqual({ success: false, error: `Maximum ${MAX_TAGS} tags allowed` })
    expect(mockUpdate).not.toHaveBeenCalled()
  })

  it("does not reveal tasks owned by another user", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } })
    mockFindUnique.mockResolvedValue(null)

    const result = await addTaskTag("task-2", "frontend")

    expect(result).toEqual({ success: false, error: "Task not found" })
    expect(mockUpdate).not.toHaveBeenCalled()
  })

  it("requires an authenticated user", async () => {
    mockAuth.mockResolvedValue(null)

    const result = await addTaskTag("task-1", "frontend")

    expect(result).toEqual({ success: false, error: "Unauthorized" })
    expect(mockFindUnique).not.toHaveBeenCalled()
  })

  it("prevents the demo user from adding tags", async () => {
    const previousDemoEmail = process.env.DEMO_USER_EMAIL
    process.env.DEMO_USER_EMAIL = "demo@nexus.local"
    mockAuth.mockResolvedValue({
      user: { id: "demo-user", email: "demo@nexus.local" },
    })

    try {
      const result = await addTaskTag("task-1", "frontend")

      expect(result).toEqual({ success: false, error: DEMO_ERROR })
      expect(mockFindUnique).not.toHaveBeenCalled()
    } finally {
      if (previousDemoEmail === undefined) delete process.env.DEMO_USER_EMAIL
      else process.env.DEMO_USER_EMAIL = previousDemoEmail
    }
  })
})
