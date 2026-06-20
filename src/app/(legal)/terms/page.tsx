import type { Metadata } from "next"

export const metadata: Metadata = { title: "Terms of Service" }

export default function TermsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Terms of Service</h1>
        <p className="text-sm text-muted-foreground">Last updated: June 2026</p>
      </div>
      <div className="rounded-xl border bg-muted/40 px-6 py-10 text-center space-y-2">
        <p className="text-sm font-medium">Coming soon</p>
        <p className="text-xs text-muted-foreground">
          Our terms of service are being drafted. Check back later.
        </p>
      </div>
    </div>
  )
}
