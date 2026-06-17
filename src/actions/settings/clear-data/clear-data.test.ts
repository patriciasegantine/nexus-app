/** @jest-environment node */
import { clearAllData } from "@/actions/settings"
import { auth } from "@/auth"
import { CLEAR_DATA_CONFIRMATION } from "@/constants/settings"
import { AppRoutes } from "@/constants/routes"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

jest.mock("@/auth", () => ({
  auth: jest.fn(),
}))

jest.mock("@/lib/db", () => ({
  db: {
    task: { deleteMany: jest.fn() },
    project: { deleteMany: jest.fn() },
    $transaction: jest.fn(),
  },
}))

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}))

function clearDataFormData(confirmation = CLEAR_DATA_CONFIRMATION) {
  const formData = new FormData()
  formData.set("confirmation", confirmation)
  return formData
}

describe("clearAllData", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("deletes tasks and projects for the authenticated user", async () => {
    ;(auth as jest.Mock).mockResolvedValue({ user: { id: "user-1" } })
    ;(db.task.deleteMany as jest.Mock).mockReturnValue("delete-tasks")
    ;(db.project.deleteMany as jest.Mock).mockReturnValue("delete-projects")
    ;(db.$transaction as jest.Mock).mockResolvedValue([])

    const result = await clearAllData(clearDataFormData())

    expect(result).toEqual({ success: true, data: undefined })
    expect(db.task.deleteMany).toHaveBeenCalledWith({ where: { userId: "user-1" } })
    expect(db.project.deleteMany).toHaveBeenCalledWith({ where: { userId: "user-1" } })
    expect(db.$transaction).toHaveBeenCalledWith(["delete-tasks", "delete-projects"])
    expect(revalidatePath).toHaveBeenCalledWith(AppRoutes.DASHBOARD.HOME)
  })

  it("requires the exact slug confirmation", async () => {
    ;(auth as jest.Mock).mockResolvedValue({ user: { id: "user-1" } })

    const result = await clearAllData(clearDataFormData("DELETE"))

    expect(result.success).toBe(false)
    expect(db.$transaction).not.toHaveBeenCalled()
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it("requires an authenticated user", async () => {
    ;(auth as jest.Mock).mockResolvedValue(null)

    const result = await clearAllData(clearDataFormData())

    expect(result).toEqual({ success: false, error: "Unauthorized" })
    expect(db.$transaction).not.toHaveBeenCalled()
  })
})
