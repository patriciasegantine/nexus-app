/** @jest-environment node */
import { updateProjectTag } from "@/actions/projects"
import { auth } from "@/auth"
import { AppRoutes } from "@/constants/routes"
import { MAX_TAGS } from "@/constants/tags"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

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

describe("updateProjectTag", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("adds a normalized tag to a user-owned project", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } })
    mockFindUnique.mockResolvedValue({ tags: ["design"] })
    mockUpdate.mockResolvedValue({})

    const result = await updateProjectTag("project-1", " Frontend ", "add")

    expect(result).toEqual({ success: true, data: ["design", "frontend"] })
    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: "project-1", userId: "user-1" },
      select: { tags: true },
    })
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "project-1", userId: "user-1" },
      data: { tags: ["design", "frontend"] },
    })
    expect(revalidatePath).toHaveBeenCalledWith(AppRoutes.DASHBOARD.PROJECTS)
    expect(revalidatePath).toHaveBeenCalledWith(AppRoutes.DASHBOARD.HOME)
  })

  it("removes a normalized tag from a user-owned project", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } })
    mockFindUnique.mockResolvedValue({
      tags: ["design", "frontend", "ux"],
    })
    mockUpdate.mockResolvedValue({})

    const result = await updateProjectTag("project-1", " Frontend ", "remove")

    expect(result).toEqual({ success: true, data: ["design", "ux"] })
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "project-1", userId: "user-1" },
      data: { tags: ["design", "ux"] },
    })
    expect(revalidatePath).toHaveBeenCalledWith(AppRoutes.DASHBOARD.PROJECTS)
    expect(revalidatePath).toHaveBeenCalledWith(AppRoutes.DASHBOARD.HOME)
  })

  it("rejects a tag with disallowed characters when adding", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } })

    const result = await updateProjectTag("project-1", "#,mnmnm", "add")

    expect(result).toEqual({
      success: false,
      error: "Tags can only contain letters and numbers, separated by spaces, hyphens or underscores",
    })
    expect(mockFindUnique).not.toHaveBeenCalled()
  })

  it("still allows removing a legacy malformed tag", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } })
    mockFindUnique.mockResolvedValue({ tags: ["design", "#,mnmnm"] })
    mockUpdate.mockResolvedValue({})

    const result = await updateProjectTag("project-1", "#,mnmnm", "remove")

    expect(result).toEqual({ success: true, data: ["design"] })
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "project-1", userId: "user-1" },
      data: { tags: ["design"] },
    })
  })

  it("rejects duplicate tags without updating", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } })
    mockFindUnique.mockResolvedValue({ tags: ["frontend"] })

    const result = await updateProjectTag("project-1", "frontend", "add")

    expect(result).toEqual({ success: false, error: "Tag already added" })
    expect(mockUpdate).not.toHaveBeenCalled()
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it("rejects tags beyond the project tag limit", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } })
    mockFindUnique.mockResolvedValue({
      tags: Array.from({ length: MAX_TAGS }, (_, index) => `tag-${index}`),
    })

    const result = await updateProjectTag("project-1", "extra", "add")

    expect(result).toEqual({ success: false, error: `Maximum ${MAX_TAGS} tags allowed` })
    expect(mockUpdate).not.toHaveBeenCalled()
  })

  it("does not reveal projects owned by another user", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } })
    mockFindUnique.mockResolvedValue(null)

    const result = await updateProjectTag("project-2", "frontend", "add")

    expect(result).toEqual({ success: false, error: "Project not found" })
    expect(mockUpdate).not.toHaveBeenCalled()
  })

  it("requires an authenticated user", async () => {
    mockAuth.mockResolvedValue(null)

    const result = await updateProjectTag("project-1", "frontend", "add")

    expect(result).toEqual({ success: false, error: "Unauthorized" })
    expect(mockFindUnique).not.toHaveBeenCalled()
  })
})
