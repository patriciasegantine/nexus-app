/** @jest-environment node */
import { fetchProjects } from "@/actions/projects"
import { auth } from "@/auth"
import { db } from "@/lib/db"

jest.mock("@/auth", () => ({
  auth: jest.fn(),
}))

jest.mock("@/lib/db", () => ({
  db: {
    project: {
      findMany: jest.fn(),
    },
  },
}))

const mockAuth = auth as jest.Mock
const mockFindMany = db.project.findMany as jest.Mock

describe("fetchProjects", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("returns the user's projects ordered by most recently created", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } })
    mockFindMany.mockResolvedValue([
      { id: "project-2", name: "Newer" },
      { id: "project-1", name: "Older" },
    ])

    const result = await fetchProjects()

    expect(result).toEqual([
      { id: "project-2", name: "Newer" },
      { id: "project-1", name: "Older" },
    ])
    expect(mockFindMany).toHaveBeenCalledWith({
      where: { userId: "user-1" },
      select: { id: true, name: true },
      orderBy: { createdAt: "desc" },
    })
  })

  it("returns an empty array when unauthenticated", async () => {
    mockAuth.mockResolvedValue(null)

    const result = await fetchProjects()

    expect(result).toEqual([])
    expect(mockFindMany).not.toHaveBeenCalled()
  })
})
