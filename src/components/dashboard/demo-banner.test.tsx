import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { DemoBanner } from "@/components/dashboard/demo-banner"
import { signOut, useSession } from "next-auth/react"
import { AppRoutes } from "@/constants/routes"

jest.mock("next-auth/react", () => ({
  signOut: jest.fn(),
  useSession: jest.fn(),
}))

describe("DemoBanner", () => {
  const originalDemoEmail = process.env.NEXT_PUBLIC_DEMO_USER_EMAIL

  beforeEach(() => {
    jest.clearAllMocks()
    process.env.NEXT_PUBLIC_DEMO_USER_EMAIL = "demo@nexus.local"
  })

  afterAll(() => {
    if (originalDemoEmail === undefined) delete process.env.NEXT_PUBLIC_DEMO_USER_EMAIL
    else process.env.NEXT_PUBLIC_DEMO_USER_EMAIL = originalDemoEmail
  })

  it("is hidden for regular users", () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: { user: { email: "person@example.com" } },
    })

    render(<DemoBanner />)

    expect(screen.queryByText(/you're viewing a demo/i)).not.toBeInTheDocument()
  })

  it("shows the read-only message for the demo user", () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: { user: { email: "demo@nexus.local" } },
    })

    render(<DemoBanner />)

    expect(screen.getByText(/changes won't be saved/i)).toBeInTheDocument()
  })

  it("signs out before opening registration", async () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: { user: { email: "demo@nexus.local" } },
    })
    ;(signOut as jest.Mock).mockResolvedValue(undefined)

    render(<DemoBanner />)
    fireEvent.click(screen.getByRole("button", { name: "Sign up free" }))

    await waitFor(() => {
      expect(signOut).toHaveBeenCalledWith({ callbackUrl: AppRoutes.AUTH.REGISTER })
    })
  })
})
