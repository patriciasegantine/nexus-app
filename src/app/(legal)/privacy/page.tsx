import type { Metadata } from "next"

export const metadata: Metadata = { title: "Privacy Policy" }

export default function PrivacyPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: June 2026</p>
      </div>
      <div className="rounded-xl border bg-muted/40 px-6 py-10 text-center space-y-2">
        <p className="text-sm font-medium">Coming soon</p>
        <p className="text-xs text-muted-foreground">
          Our privacy policy is being drafted. Check back later.
        </p>
      </div>
    </div>
  )
}
