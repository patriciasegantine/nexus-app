'use client'

import { usePathname } from "next/navigation"
import { FooterNav } from "@/components/footer/footer-nav"

export function LegalFooter() {
  const pathname = usePathname()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t">
      <div className="container max-w-2xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>© {year} Nexus. All rights reserved.</span>
        <FooterNav active={pathname} />
      </div>
    </footer>
  )
}
