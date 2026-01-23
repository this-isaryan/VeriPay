"use client";

import { useEffect, useState } from "react";
import InvoiceTable from "@/components/InvoiceTable";
import { Invoice } from "@/lib/types";

export default function DashboardPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInvoices() {
      const res = await fetch("http://127.0.0.1:8000/invoices");
      const data = await res.json();
      setInvoices(data);
      setLoading(false);
    }

    fetchInvoices();
  }, []);

  if (loading) {
    return <p>Loading invoices…</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <InvoiceTable invoices={invoices} />
    </div>
  );
}