import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FileCheck, AlertTriangle, ShieldCheck, Clock } from "lucide-react"

const stats = [
  {
    label: "Invoices processed",
    value: "128",
    trend: "+14 this week",
    trendUp: true,
    icon: FileCheck,
  },
  {
    label: "High-risk flags",
    value: "6",
    trend: "2 require review",
    trendUp: false,
    icon: AlertTriangle,
  },
  {
    label: "Trusted issuers",
    value: "42",
    trend: "98% verified",
    trendUp: true,
    icon: ShieldCheck,
  },
  {
    label: "Avg. turnaround",
    value: "3.2m",
    trend: "-18% vs last month",
    trendUp: true,
    icon: Clock,
  },
]

export default function StatCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card
            key={stat.label}
            className="border-0 bg-card/70 shadow-sm backdrop-blur-sm"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground/60" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold tracking-tight text-foreground">
                {stat.value}
              </p>
              <p
                className={`mt-1 text-xs ${
                  stat.trendUp
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {stat.trend}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
