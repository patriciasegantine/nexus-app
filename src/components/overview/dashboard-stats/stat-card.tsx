import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { LucideIcon } from 'lucide-react'

export interface StatCardProps {
  title: string
  value: number
  description: string
  Icon: LucideIcon
  color: string
  href: string
}

export function StatCard({ title, value, description, Icon, color, href }: StatCardProps) {
  return (
    <Link
      href={href}
      className="group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      aria-label={`View tasks: ${title}`}
    >
      <Card className="h-full transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground truncate pr-1">{title}</CardTitle>
          <div
            className="h-8 w-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)` }}
          >
            <Icon className="h-4 w-4" style={{ color }} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
