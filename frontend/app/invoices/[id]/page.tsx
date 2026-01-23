"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import StatusBadge from "@/components/StatusBadge";

export default function InvoiceDetailPage() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInvoice() {
      const res = await fetch(
        `http://127.0.0.1:8000/invoices/${id}`
      );
      const data = await res.json();
      setInvoice(data);
      setLoading(false);
    }

    fetchInvoice();
  }, [id]);

  if (loading) return <p>Loading invoice…</p>;
  if (!invoice) return <p>Invoice not found.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Invoice #{invoice.invoice_id}
      </h1>

      <div className="mb-4">
        <StatusBadge status={invoice.status} />
      </div>

      <section className="border rounded p-4 mb-6 bg-white">
        <h2 className="font-semibold mb-2">Metadata</h2>
        <p><b>File hash:</b> {invoice.file_hash}</p>
        <p><b>Uploaded:</b> {invoice.created_at}</p>
      </section>

      <section className="border rounded p-4 bg-white">
        <h2 className="font-semibold mb-2">Verification Summary</h2>
        <p>
          <b>Signed:</b>{" "}
          {invoice.is_signed ? "Yes" : "No"}
        </p>
        <p>
          <b>Crypto valid:</b>{" "}
          {invoice.crypto_valid === null
            ? "N/A"
            : invoice.crypto_valid
            ? "Valid"
            : "Invalid"}
        </p>
        {invoice.signer_fingerprint && (
          <p>
            <b>Signer fingerprint:</b>{" "}
            {invoice.signer_fingerprint}
          </p>
        )}
      </section>
    </div>
  );
}
