/** @jest-environment node */
import { changePassword } from "@/actions/settings"
import { auth } from "@/auth"
import { AUTH_MESSAGES } from "@/constants/messages"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"

jest.mock("@/auth", () => ({
  auth: jest.fn(),
}))

jest.mock("@/lib/db", () => ({
  db: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}))

jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}))

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}))

function passwordFormData(overrides: Partial<Record<"currentPassword" | "newPassword" | "confirmPassword", string>> = {}) {
  const formData = new FormData()
  formData.set("currentPassword", overrides.currentPassword ?? "OldStrong@123")
  formData.set("newPassword", overrides.newPassword ?? "NewStrong@123")
  formData.set("confirmPassword", overrides.confirmPassword ?? "NewStrong@123")
  return formData
}

describe("changePassword", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("updates password for an email/password user", async () => {
    ;(auth as jest.Mock).mockResolvedValue({ user: { id: "user-1" } })
    ;(db.user.findUnique as jest.Mock).mockResolvedValue({ id: "user-1", password: "old-hashed" })
    ;(bcrypt.compare as jest.Mock)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false)
    ;(bcrypt.hash as jest.Mock).mockResolvedValue("new-hashed")
    ;(db.user.update as jest.Mock).mockResolvedValue({})

    const result = await changePassword(passwordFormData())

    expect(result).toEqual({ success: true, data: undefined })
    expect(db.user.update).toHaveBeenCalledWith({
      where: { id: "user-1" },
      data: { password: "new-hashed" },
    })
    expect(revalidatePath).toHaveBeenCalledWith("/settings")
  })

  it("rejects an incorrect current password", async () => {
    ;(auth as jest.Mock).mockResolvedValue({ user: { id: "user-1" } })
    ;(db.user.findUnique as jest.Mock).mockResolvedValue({ id: "user-1", password: "old-hashed" })
    ;(bcrypt.compare as jest.Mock).mockResolvedValueOnce(false)

    const result = await changePassword(passwordFormData())

    expect(result).toEqual({ success: false, error: "Current password is incorrect" })
    expect(db.user.update).not.toHaveBeenCalled()
  })

  it("rejects reusing the current password", async () => {
    ;(auth as jest.Mock).mockResolvedValue({ user: { id: "user-1" } })
    ;(db.user.findUnique as jest.Mock).mockResolvedValue({ id: "user-1", password: "old-hashed" })
    ;(bcrypt.compare as jest.Mock)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)

    const result = await changePassword(passwordFormData())

    expect(result).toEqual({ success: false, error: AUTH_MESSAGES.SAME_PASSWORD })
    expect(db.user.update).not.toHaveBeenCalled()
  })

  it("rejects OAuth-only users without a password", async () => {
    ;(auth as jest.Mock).mockResolvedValue({ user: { id: "user-1" } })
    ;(db.user.findUnique as jest.Mock).mockResolvedValue({ id: "user-1", password: null })

    const result = await changePassword(passwordFormData())

    expect(result).toEqual({
      success: false,
      error: "Password changes are only available for email/password accounts",
    })
    expect(bcrypt.compare).not.toHaveBeenCalled()
    expect(db.user.update).not.toHaveBeenCalled()
  })

  it("validates password rules before reading the user", async () => {
    ;(auth as jest.Mock).mockResolvedValue({ user: { id: "user-1" } })

    const result = await changePassword(passwordFormData({
      newPassword: "weakpassword",
      confirmPassword: "weakpassword",
    }))

    expect(result.success).toBe(false)
    expect(db.user.findUnique).not.toHaveBeenCalled()
  })

  it("requires an authenticated user", async () => {
    ;(auth as jest.Mock).mockResolvedValue(null)

    const result = await changePassword(passwordFormData())

    expect(result).toEqual({ success: false, error: "Unauthorized" })
    expect(db.user.findUnique).not.toHaveBeenCalled()
  })
})
