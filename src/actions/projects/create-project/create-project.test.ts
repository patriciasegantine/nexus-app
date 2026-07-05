/** @jest-environment node */
import { createProject } from "@/actions/projects"
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
      create: jest.fn(),
    },
  },
}))

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}))

const mockAuth = auth as jest.Mock
const mockFindUnique = db.project.findUnique as jest.Mock
const mockCreate = db.project.create as jest.Mock

function projectFormData(overrides: Partial<Record<"name" | "description" | "color" | "tags", string>> = {}) {
  const formData = new FormData()
  formData.set("name", overrides.name ?? "Website Redesign")
  formData.set("description", overrides.description ?? "Refresh the marketing site")
  formData.set("color", overrides.color ?? "#3b82f6")
  formData.set("tags", overrides.tags ?? JSON.stringify(["design", "frontend"]))
  return formData
}

describe("createProject", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("creates a project with slug, tags, and user ownership", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } })
    mockFindUnique.mockResolvedValue(null)
    mockCreate.mockResolvedValue({ id: "project-1" })

    const result = await createProject(projectFormData())

    expect(result).toEqual({ success: true, data: { id: "project-1" } })
    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { slug: "website-redesign" },
      select: { id: true },
    })
    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        name: "Website Redesign",
        slug: "website-redesign",
        description: "Refresh the marketing site",
        color: "#3b82f6",
        tags: ["design", "frontend"],
        status: "ACTIVE",
        priority: null,
        startDate: null,
        targetDate: null,
        icon: null,
        userId: "user-1",
      },
      select: { id: true },
    })
    expect(revalidatePath).toHaveBeenCalledWith(AppRoutes.DASHBOARD.PROJECTS)
    expect(revalidatePath).toHaveBeenCalledWith(AppRoutes.DASHBOARD.HOME)
  })

  it("generates a unique slug when the base slug already exists", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } })
    mockFindUnique
      .mockResolvedValueOnce({ id: "existing-project" })
      .mockResolvedValueOnce(null)
    mockCreate.mockResolvedValue({ id: "project-1" })

    const result = await createProject(projectFormData())

    expect(result.success).toBe(true)
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ slug: "website-redesign-1" }),
      }),
    )
  })

  it("rejects invalid input before writing to the database", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } })

    const result = await createProject(projectFormData({ name: "No", color: "blue" }))

    expect(result.success).toBe(false)
    expect(mockFindUnique).not.toHaveBeenCalled()
    expect(mockCreate).not.toHaveBeenCalled()
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it("requires an authenticated user", async () => {
    mockAuth.mockResolvedValue(null)

    const result = await createProject(projectFormData())

    expect(result).toEqual({ success: false, error: "Unauthorized" })
    expect(mockCreate).not.toHaveBeenCalled()
  })

  it("prevents the demo user from creating projects", async () => {
    const previousDemoEmail = process.env.DEMO_USER_EMAIL
    process.env.DEMO_USER_EMAIL = "demo@nexus.local"
    mockAuth.mockResolvedValue({
      user: { id: "demo-user", email: "demo@nexus.local" },
    })

    try {
      const result = await createProject(projectFormData())

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
