import type { Metadata } from "next"

export const metadata: Metadata = { title: "Status" }

export default function StatusPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Status</h1>
        <p className="text-sm text-muted-foreground">System health and incidents</p>
      </div>
      <div className="rounded-xl border bg-muted/40 px-6 py-10 text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          <p className="text-sm font-medium">All systems operational</p>
        </div>
        <p className="text-xs text-muted-foreground">
          No incidents reported.
        </p>
      </div>
    </div>
  )
}
