import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AppRoutes } from "@/constants/routes"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { CopyLinkButton } from "@/components/about/copy-link-button"
import { LayoutDashboard, FolderKanban, ListTodo } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? "http://localhost:3000"),
  title: "About",
  description: "Nexus — Connect and organize your workflow. The central hub for your boards and projects.",
  openGraph: {
    title: "Nexus — Your central hub for projects and tasks",
    description: "Organize work, track progress, and stay on top of everything — all in one place.",
    images: [{ url: "/preview.png" }],
  },
}

const features = [
  {
    icon: FolderKanban,
    title: "Projects",
    description: "Organize your work into projects with custom tags and priorities.",
  },
  {
    icon: ListTodo,
    title: "Tasks",
    description: "Track progress with deadlines, filters, and status updates.",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    description: "Get a clear overview of everything happening across your workspace.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-6 h-16 border-b">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-foreground flex items-center justify-center">
            <span className="text-background text-sm font-bold">N</span>
          </div>
          <span className="font-semibold text-sm">Nexus</span>
        </div>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 gap-16">
        {/* Hero */}
        <section className="text-center max-w-lg space-y-4">
          <h1 className="text-3xl md:text-4xl font-light tracking-tight">
            Your central hub for projects and tasks
          </h1>
          <p className="text-muted-foreground text-base">
            Nexus helps you organize work, track progress, and stay on top of everything — all in one place.
          </p>
        </section>

        {/* Features */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-2xl">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-xl border bg-card p-5 space-y-2"
            >
              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                <Icon size={18} className="text-foreground" />
              </div>
              <h2 className="font-medium text-sm">{title}</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
            </div>
          ))}
        </section>

        {/* CTA */}
        <section className="flex flex-col items-center gap-4 text-center">
          <Button asChild size="lg" className="h-11 px-8">
            <Link href={AppRoutes.AUTH.LOGIN}>Open Nexus</Link>
          </Button>

          <div className="flex items-center gap-3">
            <CopyLinkButton />
          </div>

          <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
            Want to sign in with Google?{" "}
            <strong className="text-foreground font-medium">Open this link in your browser</strong>{" "}
            — LinkedIn&apos;s in-app browser doesn&apos;t support Google authentication.
          </p>
        </section>
      </main>

      <footer className="text-center py-6 text-xs text-muted-foreground border-t">
        © {new Date().getFullYear()} Nexus. Built with Next.js.
      </footer>
    </div>
  )
}
