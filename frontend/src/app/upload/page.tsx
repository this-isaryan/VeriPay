"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [autoAnalyze, setAutoAnalyze] = useState(true);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("");
    setResult(null);

    if (!file) {
      setStatus("Please choose a PDF or image file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setStatus("Uploading invoice...");
      const response = await fetch(`${API_BASE}/invoices/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      let data: any = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (response.status === 401) {
        setStatus("Session expired. Please log in again.");
        router.push("/login");
        return;
      }

      if (!response.ok) {
        setStatus(data?.detail ?? "Upload failed.");
        return;
      }

      setResult(data);
      setStatus("Upload complete.");
      if (autoAnalyze) {
        const invoiceId = String(data.invoice_id);
        router.push(`/analysis?invoiceId=${invoiceId}&run=1`);
      }
    } catch (_error) {
      setStatus("Unable to reach the API.");
    }
  };

  return (
    <main className="page">
      <section className="panel">
        <span className="tag">Upload</span>
        <h1 className="title">Submit an invoice for verification.</h1>
        <p className="subtitle">
          Upload a PDF or image to run integrity checks, hash matching, and
          signer validation.
        </p>
      </section>

      <section className="card upload-card">
        <form className="form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="invoice">Invoice file</label>
            <input
              id="invoice"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(event) =>
                setFile(event.target.files ? event.target.files[0] : null)
              }
              className="file-input"
              required
            />
          </div>
          <div className="actions">
            <button className="button" type="submit">
              Upload invoice
            </button>
            <span className="hint">
              Allowed: PDF, PNG, JPG • Max size per browser limits
            </span>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={autoAnalyze}
              onChange={(event) => setAutoAnalyze(event.target.checked)}
            />
            <span>Analyze immediately after upload</span>
          </label>
          {status ? <p className="status">{status}</p> : null}
        </form>
      </section>

      {result ? (
        <section className="card">
          <h3>Upload summary</h3>
          <div className="upload-summary">
            <div>
              <p className="metric-label">Status</p>
              <p className="metric-value">{String(result.status)}</p>
            </div>
            <div>
              <p className="metric-label">Invoice ID</p>
              <p className="metric-value">{String(result.invoice_id)}</p>
            </div>
            <div>
              <p className="metric-label">File type</p>
              <p className="metric-value">{String(result.file_type)}</p>
            </div>
          </div>
          <div className="upload-meta">
            <p className="metric-label">File hash</p>
            <p className="mono">{String(result.file_hash)}</p>
          </div>
          <div className="dashboard-actions">
            <Link
              className="button"
              href={`/analysis?invoiceId=${String(result.invoice_id)}`}
            >
              Analyze this invoice
            </Link>
            <Link className="button outline" href="/analysis">
              Go to analysis page
            </Link>
          </div>
        </section>
      ) : null}

      <p className="hint">
        API endpoint: <span className="mono">{API_BASE}</span>
      </p>
    </main>
  );
}
