import { FooterNav } from "@/components/footer/footer-nav"

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t bg-background">
      <div className="container mx-auto px-4 md:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>© {year} Nexus. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <FooterNav />
          <span className="pl-2 border-l">v0.1.0</span>
        </div>
      </div>
    </footer>
  )
}
