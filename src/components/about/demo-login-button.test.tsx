import { act, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { DemoLoginButton } from "@/components/about/demo-login-button"
import { demoLogin } from "@/actions/demo/demo-login"

const replace = jest.fn()
const refresh = jest.fn()
const update = jest.fn()

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace, refresh }),
}))

jest.mock("next-auth/react", () => ({
  useSession: () => ({ update }),
}))

jest.mock("@/actions/demo/demo-login", () => ({
  demoLogin: jest.fn(),
}))

describe("DemoLoginButton", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("shows a loading state while the demo session is being created", async () => {
    let resolveLogin!: (result: { success: false; error: string }) => void
    ;(demoLogin as jest.Mock).mockReturnValue(
      new Promise((resolve) => {
        resolveLogin = resolve
      }),
    )

    render(<DemoLoginButton />)
    fireEvent.click(screen.getByRole("button", { name: "View live demo" }))

    const button = await screen.findByRole("button", { name: "Opening demo..." })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute("aria-busy", "true")

    await act(async () => {
      resolveLogin({ success: false, error: "Demo unavailable" })
    })
  })

  it("updates the session before navigating to the dashboard", async () => {
    ;(demoLogin as jest.Mock).mockResolvedValue({ success: true })
    update.mockResolvedValue(undefined)

    render(<DemoLoginButton />)
    fireEvent.click(screen.getByRole("button", { name: "View live demo" }))

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/"))
    expect(update).toHaveBeenCalledTimes(1)
    expect(refresh).toHaveBeenCalledTimes(1)
    expect(update.mock.invocationCallOrder[0]).toBeLessThan(replace.mock.invocationCallOrder[0])
  })

  it("shows the action error without navigating", async () => {
    ;(demoLogin as jest.Mock).mockResolvedValue({
      success: false,
      error: "The demo is temporarily unavailable.",
    })

    render(<DemoLoginButton />)
    fireEvent.click(screen.getByRole("button", { name: "View live demo" }))

    expect(await screen.findByText("The demo is temporarily unavailable.")).toBeInTheDocument()
    expect(update).not.toHaveBeenCalled()
    expect(replace).not.toHaveBeenCalled()
  })
})
