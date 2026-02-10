import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

const queueItems = [
  {
    issuer: "ACME Hardware",
    id: "INV-4012",
    time: "2m ago",
    status: "Review" as const,
  },
  {
    issuer: "Juniper Labs",
    id: "INV-4029",
    time: "7m ago",
    status: "Approved" as const,
  },
  {
    issuer: "Orchid Supply",
    id: "INV-3991",
    time: "15m ago",
    status: "Escalated" as const,
  },
]

const statusStyles = {
  Approved:
    "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50",
  Review:
    "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50",
  Escalated:
    "bg-red-50 text-red-700 border-red-200 hover:bg-red-50",
}

const trustData = [
  { label: "Verified issuers", value: 76 },
  { label: "Pending checks", value: 18 },
  { label: "High-risk issuers", value: 6 },
]

export default function VerificationQueue() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Live verification queue */}
      <Card
        className="
    border-border/60
    shadow-sm
    backdrop-blur-sm
    transition-all
    hover:shadow-md
    motion-safe:animate-in
    motion-safe:fade-in
    motion-safe:slide-in-from-bottom-2
  "
      >
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">
            Live verification queue
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {queueItems.map((item) => (
            <div
              key={item.id}
              className="
    flex items-center justify-between
    rounded-xl
    border border-border/60
    bg-muted/30
    px-4 py-3
    transition-all
    hover:bg-muted/50
    hover:shadow-sm
    motion-safe:animate-in
    motion-safe:fade-in
    motion-safe:slide-in-from-left-2
  "
            >
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {item.issuer}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.id} &middot; {item.time}
                </p>
              </div>
              <Badge
                variant="outline"
                className={statusStyles[item.status]}
              >
                {item.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Issuer trust distribution */}
      <Card
        className="
    border-border/60
    shadow-sm
    backdrop-blur-sm
    transition-all
    hover:shadow-md
    motion-safe:animate-in
    motion-safe:fade-in
    motion-safe:slide-in-from-bottom-2
  "
      >
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">
            Issuer trust distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {trustData.map((item) => (
            <div key={item.label} className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-medium text-foreground">{item.value}%</span>
              </div>
              <Progress value={item.value} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Next actions */}
      <Card
        className="
    border-border/60
    shadow-sm
    backdrop-blur-sm
    transition-all
    hover:shadow-md
    motion-safe:animate-in
    motion-safe:fade-in
    motion-safe:slide-in-from-bottom-2
   lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">
            Next actions
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Keep your verification loop tight by triaging flagged invoices and
            generating compliance-ready summaries.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button>Start verification</Button>
            <Button variant="outline">Export compliance report</Button>
          </div>
          <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50/50 px-4 py-3 text-sm text-amber-800">
            3 invoices are awaiting manual review with anomaly scores above 0.7.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}