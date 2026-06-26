'use client'

import { usePathname } from "next/navigation"
import Link from "next/link"
import { FooterNav } from "@/components/footer/footer-nav"

export function LegalFooter() {
  const pathname = usePathname()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 md:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>© {year} Nexus. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="hover:text-foreground transition-colors"
          >
            Home
          </Link>
          <FooterNav active={pathname} />
        </div>
      </div>
    </footer>
  )
}
