/** @jest-environment node */
import { deleteAccount } from "@/actions/settings"
import { auth } from "@/auth"
import { DELETE_ACCOUNT_CONFIRMATION } from "@/constants/settings"
import { db } from "@/lib/db"

jest.mock("@/auth", () => ({
  auth: jest.fn(),
}))

jest.mock("@/lib/db", () => ({
  db: {
    user: {
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    verificationToken: {
      deleteMany: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}))

function deleteAccountFormData(confirmation = DELETE_ACCOUNT_CONFIRMATION) {
  const formData = new FormData()
  formData.set("confirmation", confirmation)
  return formData
}

describe("deleteAccount", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("deletes the authenticated user and password reset tokens", async () => {
    ;(auth as jest.Mock).mockResolvedValue({ user: { id: "user-1" } })
    ;(db.user.findUnique as jest.Mock).mockResolvedValue({
      id: "user-1",
      email: "patricia@example.com",
    })
    ;(db.verificationToken.deleteMany as jest.Mock).mockReturnValue("delete-tokens")
    ;(db.user.delete as jest.Mock).mockReturnValue("delete-user")
    ;(db.$transaction as jest.Mock).mockResolvedValue([])

    const result = await deleteAccount(deleteAccountFormData())

    expect(result).toEqual({ success: true, data: undefined })
    expect(db.user.findUnique).toHaveBeenCalledWith({
      where: { id: "user-1" },
      select: { id: true, email: true },
    })
    expect(db.verificationToken.deleteMany).toHaveBeenCalledWith({
      where: { identifier: "patricia@example.com" },
    })
    expect(db.user.delete).toHaveBeenCalledWith({ where: { id: "user-1" } })
    expect(db.$transaction).toHaveBeenCalledWith(["delete-tokens", "delete-user"])
  })

  it("requires the exact slug confirmation", async () => {
    ;(auth as jest.Mock).mockResolvedValue({ user: { id: "user-1" } })

    const result = await deleteAccount(deleteAccountFormData("DELETE ACCOUNT"))

    expect(result.success).toBe(false)
    expect(db.user.findUnique).not.toHaveBeenCalled()
    expect(db.$transaction).not.toHaveBeenCalled()
  })

  it("returns an error when the user no longer exists", async () => {
    ;(auth as jest.Mock).mockResolvedValue({ user: { id: "user-1" } })
    ;(db.user.findUnique as jest.Mock).mockResolvedValue(null)

    const result = await deleteAccount(deleteAccountFormData())

    expect(result).toEqual({ success: false, error: "User not found" })
    expect(db.$transaction).not.toHaveBeenCalled()
  })

  it("requires an authenticated user", async () => {
    ;(auth as jest.Mock).mockResolvedValue(null)

    const result = await deleteAccount(deleteAccountFormData())

    expect(result).toEqual({ success: false, error: "Unauthorized" })
    expect(db.user.findUnique).not.toHaveBeenCalled()
  })
})
