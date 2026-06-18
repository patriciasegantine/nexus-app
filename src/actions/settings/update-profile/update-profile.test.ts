/** @jest-environment node */
import { updateProfile } from "@/actions/settings"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

jest.mock("@/auth", () => ({
  auth: jest.fn(),
}))

jest.mock("@/lib/db", () => ({
  db: {
    user: {
      update: jest.fn(),
    },
  },
}))

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}))

function profileFormData(name = "Patricia Segantine") {
  const formData = new FormData()
  formData.set("name", name)
  return formData
}

describe("updateProfile", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("updates the user name for an authenticated user", async () => {
    ;(auth as jest.Mock).mockResolvedValue({ user: { id: "user-1" } })
    ;(db.user.update as jest.Mock).mockResolvedValue({})

    const result = await updateProfile(profileFormData())

    expect(result).toEqual({ success: true, data: undefined })
    expect(db.user.update).toHaveBeenCalledWith({
      where: { id: "user-1" },
      data: { name: "Patricia Segantine" },
    })
    expect(revalidatePath).toHaveBeenCalled()
  })

  it("trims whitespace from the name before saving", async () => {
    ;(auth as jest.Mock).mockResolvedValue({ user: { id: "user-1" } })
    ;(db.user.update as jest.Mock).mockResolvedValue({})

    await updateProfile(profileFormData("  Patricia  "))

    expect(db.user.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { name: "Patricia" } })
    )
  })

  it("rejects a name shorter than 2 characters", async () => {
    ;(auth as jest.Mock).mockResolvedValue({ user: { id: "user-1" } })

    const result = await updateProfile(profileFormData("A"))

    expect(result.success).toBe(false)
    if (!result.success) expect(result.error).toBeDefined()
    expect(db.user.update).not.toHaveBeenCalled()
  })

  it("requires an authenticated user", async () => {
    ;(auth as jest.Mock).mockResolvedValue(null)

    const result = await updateProfile(profileFormData())

    expect(result).toEqual({ success: false, error: "Unauthorized" })
    expect(db.user.update).not.toHaveBeenCalled()
  })
})
