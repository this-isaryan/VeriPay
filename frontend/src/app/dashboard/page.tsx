import StatCards from "../ui/StatCards"
import InvoicesTable from "../ui/InvoicesTable"
import VerificationQueue from "../ui/VerificationQueue"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  return (
      <div className="flex flex-col gap-8">
        {/* Hero */}
        <section className="flex flex-col gap-3">
          <Badge
            variant="secondary"
            className="w-fit text-xs font-medium uppercase tracking-wider text-muted-foreground"
          >
            Operations
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight text-balance text-foreground lg:text-4xl">
            Invoice integrity dashboard.
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            Track verifications, anomaly scores, and issuer trust signals across
            your finance workflow.
          </p>
        </section>

        {/* Stat cards */}
        <StatCards />

        {/* Invoices table */}
        <InvoicesTable />

        {/* Verification queue & trust + actions */}
        <VerificationQueue />
      </div>
  )
}
