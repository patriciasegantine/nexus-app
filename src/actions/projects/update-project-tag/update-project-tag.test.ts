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

describe("updateProjectTag", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("adds a normalized tag to a user-owned project", async () => {
    ;(auth as jest.Mock).mockResolvedValue({ user: { id: "user-1" } })
    ;(db.project.findUnique as jest.Mock).mockResolvedValue({ tags: ["design"] })
    ;(db.project.update as jest.Mock).mockResolvedValue({})

    const result = await updateProjectTag("project-1", " Frontend ", "add")

    expect(result).toEqual({ success: true, data: ["design", "frontend"] })
    expect(db.project.findUnique).toHaveBeenCalledWith({
      where: { id: "project-1", userId: "user-1" },
      select: { tags: true },
    })
    expect(db.project.update).toHaveBeenCalledWith({
      where: { id: "project-1", userId: "user-1" },
      data: { tags: ["design", "frontend"] },
    })
    expect(revalidatePath).toHaveBeenCalledWith(AppRoutes.DASHBOARD.PROJECTS)
    expect(revalidatePath).toHaveBeenCalledWith(AppRoutes.DASHBOARD.HOME)
  })

  it("removes a normalized tag from a user-owned project", async () => {
    ;(auth as jest.Mock).mockResolvedValue({ user: { id: "user-1" } })
    ;(db.project.findUnique as jest.Mock).mockResolvedValue({
      tags: ["design", "frontend", "ux"],
    })
    ;(db.project.update as jest.Mock).mockResolvedValue({})

    const result = await updateProjectTag("project-1", " Frontend ", "remove")

    expect(result).toEqual({ success: true, data: ["design", "ux"] })
    expect(db.project.update).toHaveBeenCalledWith({
      where: { id: "project-1", userId: "user-1" },
      data: { tags: ["design", "ux"] },
    })
    expect(revalidatePath).toHaveBeenCalledWith(AppRoutes.DASHBOARD.PROJECTS)
    expect(revalidatePath).toHaveBeenCalledWith(AppRoutes.DASHBOARD.HOME)
  })

  it("rejects duplicate tags without updating", async () => {
    ;(auth as jest.Mock).mockResolvedValue({ user: { id: "user-1" } })
    ;(db.project.findUnique as jest.Mock).mockResolvedValue({ tags: ["frontend"] })

    const result = await updateProjectTag("project-1", "frontend", "add")

    expect(result).toEqual({ success: false, error: "Tag already added" })
    expect(db.project.update).not.toHaveBeenCalled()
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it("rejects tags beyond the project tag limit", async () => {
    ;(auth as jest.Mock).mockResolvedValue({ user: { id: "user-1" } })
    ;(db.project.findUnique as jest.Mock).mockResolvedValue({
      tags: Array.from({ length: MAX_TAGS }, (_, index) => `tag-${index}`),
    })

    const result = await updateProjectTag("project-1", "extra", "add")

    expect(result).toEqual({ success: false, error: `Maximum ${MAX_TAGS} tags allowed` })
    expect(db.project.update).not.toHaveBeenCalled()
  })

  it("does not reveal projects owned by another user", async () => {
    ;(auth as jest.Mock).mockResolvedValue({ user: { id: "user-1" } })
    ;(db.project.findUnique as jest.Mock).mockResolvedValue(null)

    const result = await updateProjectTag("project-2", "frontend", "add")

    expect(result).toEqual({ success: false, error: "Project not found" })
    expect(db.project.update).not.toHaveBeenCalled()
  })

  it("requires an authenticated user", async () => {
    ;(auth as jest.Mock).mockResolvedValue(null)

    const result = await updateProjectTag("project-1", "frontend", "add")

    expect(result).toEqual({ success: false, error: "Unauthorized" })
    expect(db.project.findUnique).not.toHaveBeenCalled()
  })
})
