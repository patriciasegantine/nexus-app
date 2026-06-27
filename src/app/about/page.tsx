import Link from "next/link"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { AboutActions, DemoCallToAction } from "@/components/about/about-actions"
import { FeatureCards } from "@/components/about/feature-cards"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Github, Globe } from "lucide-react"
import type { Metadata } from "next"
import { BrandMark } from "@/components/brand/brand-mark"

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? "http://localhost:3000"),
  title: "About",
  description: "Nexus — A focused command center for projects, tasks, and progress.",
  openGraph: {
    title: "Nexus — Projects, tasks, and progress in motion",
    description: "Plan work, track movement, and keep momentum across every project.",
    images: [{ url: "/preview.png" }],
  },
}

const PORTFOLIO_URL = "https://patriciasegantine.vercel.app/"
const GITHUB_PROFILE_URL = "https://github.com/patriciasegantine"
const SOURCE_URL = "https://github.com/patriciasegantine/nexus-app"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-6 h-16 border-b">
        <BrandMark />
        <TooltipProvider delayDuration={300}>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={PORTFOLIO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View Patricia Segantine's portfolio"
                  className="flex items-center justify-center h-9 w-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  <Globe size={18} />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="pointer-events-none">
                View portfolio
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={GITHUB_PROFILE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View Patricia Segantine's GitHub profile"
                  className="flex items-center justify-center h-9 w-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  <Github size={18} />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="pointer-events-none">
                View GitHub profile
              </TooltipContent>
            </Tooltip>
            <ThemeToggle showTooltip />
          </div>
        </TooltipProvider>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-10 px-6 py-16">
        {/* Hero */}
        <section className="order-1 max-w-lg space-y-4 text-center">
          <h1 className="text-3xl md:text-4xl font-light tracking-tight">
            A focused command center for projects and tasks
          </h1>
          <p className="text-muted-foreground text-base">
            Plan work, track movement, and keep momentum across every project.
          </p>
        </section>

        <DemoCallToAction className="order-2" />
        <FeatureCards className="order-3" />
        <AboutActions className="order-4" sourceUrl={SOURCE_URL} />
      </main>

      <footer className="text-center py-6 text-xs text-muted-foreground border-t">
        © {new Date().getFullYear()} Nexus. Built by{" "}
        <Link
          href={PORTFOLIO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground transition-colors hover:text-muted-foreground"
        >
          Patricia Segantine
        </Link>
        .
      </footer>
    </div>
  )
}
