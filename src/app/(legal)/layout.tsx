import { ThemeToggle } from "@/components/theme/theme-toggle"
import { LegalFooter } from "@/components/footer/legal-footer"
import { BackButton } from "@/components/footer/back-button"
import React from "react"

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-6 h-16 border-b">
        <div className="flex items-center gap-4">
          <BackButton />
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-foreground flex items-center justify-center">
              <span className="text-background text-xs font-bold">N</span>
            </div>
            <span className="font-medium text-sm">Nexus</span>
          </div>
        </div>
        <ThemeToggle />
      </header>

      <main className="flex-1 container max-w-2xl mx-auto px-6 py-16">
        {children}
      </main>

      <LegalFooter />
    </div>
  )
}
