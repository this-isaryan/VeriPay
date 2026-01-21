"use client";

import { useState } from "react";

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function handleUpload() {
    if (!file) return;

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    // 1️⃣ Upload
    const uploadRes = await fetch(
      "http://127.0.0.1:8000/invoices/upload",
      { method: "POST", body: formData }
    );

    if (!uploadRes.ok) {
      const err = await uploadRes.json();
      setResult(err);
      setLoading(false);
      return; // ⛔ STOP HERE
    }

    const uploadData = await uploadRes.json();
    const invoiceId = uploadData.invoice_id;

    // 2️⃣ Analyze ONLY if upload succeeded
    const analyzeRes = await fetch(
      `http://127.0.0.1:8000/invoices/${invoiceId}/analyze`,
      { method: "POST" }
    );

    const analysisData = await analyzeRes.json();
    setResult(analysisData);
    setLoading(false);
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>VeriPay – Invoice Analysis</h1>

      <input
        type="file"
        accept=".pdf,.png,.jpg"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <br /><br />

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Processing..." : "Upload & Analyze"}
      </button>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>Result</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </main>
  );
}
