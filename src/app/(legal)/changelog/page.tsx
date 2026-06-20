import type { Metadata } from "next"

export const metadata: Metadata = { title: "Changelog" }

export default function ChangelogPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Changelog</h1>
        <p className="text-sm text-muted-foreground">What&apos;s new in Nexus</p>
      </div>
      <div className="rounded-xl border bg-muted/40 px-6 py-10 text-center space-y-2">
        <p className="text-sm font-medium">Coming soon</p>
        <p className="text-xs text-muted-foreground">
          Release notes will be published here.
        </p>
      </div>
    </div>
  )
}
