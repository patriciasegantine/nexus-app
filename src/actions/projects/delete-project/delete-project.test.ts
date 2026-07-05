/** @jest-environment node */
import { deleteProject } from "@/actions/projects"
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
      delete: jest.fn(),
    },
  },
}))

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}))

const mockAuth = auth as jest.Mock
const mockFindUnique = db.project.findUnique as jest.Mock
const mockDelete = db.project.delete as jest.Mock

describe("deleteProject", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("deletes a user-owned project", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } })
    mockFindUnique.mockResolvedValue({ id: "project-1" })
    mockDelete.mockResolvedValue({})

    const result = await deleteProject("project-1")

    expect(result).toEqual({ success: true, data: undefined })
    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: "project-1", userId: "user-1" },
      select: { id: true },
    })
    expect(mockDelete).toHaveBeenCalledWith({
      where: { id: "project-1", userId: "user-1" },
    })
    expect(revalidatePath).toHaveBeenCalledWith(AppRoutes.DASHBOARD.PROJECTS)
    expect(revalidatePath).toHaveBeenCalledWith(AppRoutes.DASHBOARD.HOME)
  })

  it("does not reveal projects owned by another user", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } })
    mockFindUnique.mockResolvedValue(null)

    const result = await deleteProject("project-2")

    expect(result).toEqual({ success: false, error: "Project not found" })
    expect(mockDelete).not.toHaveBeenCalled()
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it("requires an authenticated user", async () => {
    mockAuth.mockResolvedValue(null)

    const result = await deleteProject("project-1")

    expect(result).toEqual({ success: false, error: "Unauthorized" })
    expect(mockFindUnique).not.toHaveBeenCalled()
    expect(mockDelete).not.toHaveBeenCalled()
  })

  it("prevents the demo user from deleting projects", async () => {
    const previousDemoEmail = process.env.DEMO_USER_EMAIL
    process.env.DEMO_USER_EMAIL = "demo@nexus.local"
    mockAuth.mockResolvedValue({
      user: { id: "demo-user", email: "demo@nexus.local" },
    })

    try {
      const result = await deleteProject("project-1")

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
