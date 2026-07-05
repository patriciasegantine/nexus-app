/** @jest-environment node */
import { updateProject } from "@/actions/projects"
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
      update: jest.fn(),
    },
  },
}))

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}))

const mockAuth = auth as jest.Mock
const mockFindUnique = db.project.findUnique as jest.Mock
const mockUpdate = db.project.update as jest.Mock

function updateFormData(fields: Partial<Record<"name" | "description" | "color", string>>) {
  const formData = new FormData()
  for (const [key, value] of Object.entries(fields)) {
    formData.set(key, value)
  }
  return formData
}

describe("updateProject", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("updates a field without regenerating the slug when name is not provided", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } })
    mockFindUnique.mockResolvedValue({ id: "project-1", name: "Website Redesign" })
    mockUpdate.mockResolvedValue({})

    const result = await updateProject("project-1", updateFormData({ description: "New description" }))

    expect(result).toEqual({ success: true, data: undefined })
    expect(mockFindUnique).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "project-1", userId: "user-1" },
      data: {
        description: "New description",
        tags: [],
        icon: null,
        priority: null,
        startDate: null,
        targetDate: null,
      },
    })
    expect(revalidatePath).toHaveBeenCalledWith(AppRoutes.DASHBOARD.PROJECTS)
    expect(revalidatePath).toHaveBeenCalledWith(AppRoutes.DASHBOARD.HOME)
  })

  it("does not regenerate the slug when name is unchanged", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } })
    mockFindUnique.mockResolvedValue({ id: "project-1", name: "Website Redesign" })
    mockUpdate.mockResolvedValue({})

    await updateProject("project-1", updateFormData({ name: "Website Redesign" }))

    expect(mockFindUnique).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "project-1", userId: "user-1" },
      data: {
        name: "Website Redesign",
        tags: [],
        icon: null,
        priority: null,
        startDate: null,
        targetDate: null,
      },
    })
  })

  it("regenerates the slug when the name changes, avoiding a collision with another project", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } })
    mockFindUnique
      .mockResolvedValueOnce({ id: "project-1", name: "Old Name" })
      .mockResolvedValueOnce({ id: "other-project" })
      .mockResolvedValueOnce(null)
    mockUpdate.mockResolvedValue({})

    const result = await updateProject("project-1", updateFormData({ name: "New Name" }))

    expect(result.success).toBe(true)
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "project-1", userId: "user-1" },
      data: {
        name: "New Name",
        tags: [],
        slug: "new-name-1",
        icon: null,
        priority: null,
        startDate: null,
        targetDate: null,
      },
    })
  })

  it("does not reveal projects owned by another user", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } })
    mockFindUnique.mockResolvedValue(null)

    const result = await updateProject("project-2", updateFormData({ description: "New description" }))

    expect(result).toEqual({ success: false, error: "Project not found" })
    expect(mockUpdate).not.toHaveBeenCalled()
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it("rejects invalid input before touching the database", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } })

    const result = await updateProject("project-1", updateFormData({ name: "No" }))

    expect(result.success).toBe(false)
    expect(mockFindUnique).not.toHaveBeenCalled()
    expect(mockUpdate).not.toHaveBeenCalled()
  })

  it("requires an authenticated user", async () => {
    mockAuth.mockResolvedValue(null)

    const result = await updateProject("project-1", updateFormData({ description: "New description" }))

    expect(result).toEqual({ success: false, error: "Unauthorized" })
    expect(mockFindUnique).not.toHaveBeenCalled()
  })

  it("prevents the demo user from updating projects", async () => {
    const previousDemoEmail = process.env.DEMO_USER_EMAIL
    process.env.DEMO_USER_EMAIL = "demo@nexus.local"
    mockAuth.mockResolvedValue({
      user: { id: "demo-user", email: "demo@nexus.local" },
    })

    try {
      const result = await updateProject("project-1", updateFormData({ description: "New description" }))

      expect(result).toEqual({ success: false, error: DEMO_ERROR })
      expect(mockFindUnique).not.toHaveBeenCalled()
      expect(mockUpdate).not.toHaveBeenCalled()
    } finally {
      if (previousDemoEmail === undefined) delete process.env.DEMO_USER_EMAIL
      else process.env.DEMO_USER_EMAIL = previousDemoEmail
    }
  })
})
