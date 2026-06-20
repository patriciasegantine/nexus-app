import Link from "next/link"

const links = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Status', href: '/status' },
  { label: 'Changelog', href: '/changelog' },
]

export function FooterNav({ active }: { active?: string }) {
  return (
    <nav className="flex items-center gap-4 text-xs text-muted-foreground">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={
            active === link.href
              ? "text-foreground font-medium"
              : "hover:text-foreground transition-colors"
          }
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
