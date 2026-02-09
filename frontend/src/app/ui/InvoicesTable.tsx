import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type InvoiceStatus = "Approved" | "Review" | "Escalated" | "Pending"

interface Invoice {
  id: string
  issuer: string
  amount: string
  date: string
  anomalyScore: number
  status: InvoiceStatus
}

const invoices: Invoice[] = [
  {
    id: "INV-4012",
    issuer: "ACME Hardware",
    amount: "$12,400.00",
    date: "Feb 7, 2026",
    anomalyScore: 0.82,
    status: "Review",
  },
  {
    id: "INV-4029",
    issuer: "Juniper Labs",
    amount: "$8,750.00",
    date: "Feb 7, 2026",
    anomalyScore: 0.12,
    status: "Approved",
  },
  {
    id: "INV-3991",
    issuer: "Orchid Supply",
    amount: "$3,200.00",
    date: "Feb 6, 2026",
    anomalyScore: 0.91,
    status: "Escalated",
  },
  {
    id: "INV-4033",
    issuer: "Summit Finance",
    amount: "$24,100.00",
    date: "Feb 6, 2026",
    anomalyScore: 0.34,
    status: "Approved",
  },
  {
    id: "INV-4041",
    issuer: "Maple Corp",
    amount: "$6,890.00",
    date: "Feb 5, 2026",
    anomalyScore: 0.65,
    status: "Pending",
  },
  {
    id: "INV-4050",
    issuer: "Baseline Logistics",
    amount: "$15,300.00",
    date: "Feb 5, 2026",
    anomalyScore: 0.08,
    status: "Approved",
  },
  {
    id: "INV-4055",
    issuer: "Redwood Analytics",
    amount: "$9,400.00",
    date: "Feb 4, 2026",
    anomalyScore: 0.73,
    status: "Review",
  },
]

const statusStyles: Record<InvoiceStatus, string> = {
  Approved:
    "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50",
  Review:
    "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50",
  Escalated:
    "bg-red-50 text-red-700 border-red-200 hover:bg-red-50",
  Pending:
    "bg-muted text-muted-foreground border-border hover:bg-muted",
}

function AnomalyDot({ score }: { score: number }) {
  const color =
    score >= 0.7
      ? "bg-red-400"
      : score >= 0.4
        ? "bg-amber-400"
        : "bg-emerald-400"

  return (
    <span className="flex items-center gap-2">
      <span className={`inline-block h-2 w-2 rounded-full ${color}`} />
      <span className="font-mono text-xs text-muted-foreground">
        {score.toFixed(2)}
      </span>
    </span>
  )
}

export default function InvoicesTable() {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-foreground">
          Recent invoices
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Invoice</TableHead>
              <TableHead>Issuer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Anomaly</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell className="font-mono text-xs font-medium text-foreground">
                  {inv.id}
                </TableCell>
                <TableCell className="text-foreground">{inv.issuer}</TableCell>
                <TableCell className="font-medium text-foreground">
                  {inv.amount}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {inv.date}
                </TableCell>
                <TableCell>
                  <AnomalyDot score={inv.anomalyScore} />
                </TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant="outline"
                    className={statusStyles[inv.status]}
                  >
                    {inv.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}