import Link from "next/link";
import { Invoice } from "@/lib/types";
import StatusBadge from "./StatusBadge";

interface Props {
  invoices: Invoice[];
}

export default function InvoiceTable({ invoices }: Props) {
  if (!invoices.length) {
    return <p>No invoices submitted yet.</p>;
  }

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b text-left">
          <th className="p-2">Invoice ID</th>
          <th className="p-2">Status</th>
          <th className="p-2">Flags</th>
          <th className="p-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {invoices.map((inv) => (
          <tr key={inv.invoice_id} className="border-b">
            <td className="p-2">{inv.invoice_id}</td>

            <td className="p-2">
              <StatusBadge status={inv.status} />
            </td>

            <td className="p-2">
              {inv.flags?.length ? inv.flags.join(", ") : "—"}
            </td>

            <td className="p-2">
              <Link
                href={`/invoices/${inv.invoice_id}`}
                className="text-blue-600"
              >
                View
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}