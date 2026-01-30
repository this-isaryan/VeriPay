"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [result, setResult] = useState<Record<string, any> | null>(null);
  const [autoAnalyze, setAutoAnalyze] = useState(true);

  // 🔽 NEW STATE FOR DUPLICATES
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateData, setDuplicateData] = useState<any>(null);

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
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus(data.detail ?? "Upload failed.");
        return;
      }

      setResult(data);
      setStatus("Upload complete.");

      // 🔴 DUPLICATE HANDLING
      if (data.status === "duplicate") {
        setDuplicateData(data);
        setShowDuplicateModal(true);
        return;
      }

      // 🟢 NORMAL FLOW
      if (data.status === "stored" && autoAnalyze) {
        const invoiceId = String(data.invoice_id);
        router.push(`/analysis?invoiceId=${invoiceId}&run=1`);
      }
    } catch {
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
            {result.file_type && (
              <div>
                <p className="metric-label">File type</p>
                <p className="metric-value">{String(result.file_type)}</p>
              </div>
            )}
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

      {/* DUPLICATE MODAL */}
      {showDuplicateModal && duplicateData ? (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Invoice already analyzed</h2>
            <p>
              This invoice was previously checked. What would you like to do?
            </p>

            <div className="modal-actions">
              <button
                className="button"
                onClick={() => {
                  router.push(
                    `/analysis?invoiceId=${duplicateData.invoice_id}`
                  );
                }}
              >
                View previous result
              </button>

              <button
                className="button outline"
                onClick={async () => {
                  if (!file) return;

                  setShowDuplicateModal(false);
                  setStatus("Rechecking invoice...");

                  const formData = new FormData();
                  formData.append("file", file);

                  const response = await fetch(
                    `${API_BASE}/invoices/upload?force_recheck=true`,
                    {
                      method: "POST",
                      body: formData,
                    }
                  );

                  const data = await response.json();
                  router.push(
                    `/analysis?invoiceId=${data.invoice_id}&run=1`
                  );
                }}
              >
                Recheck invoice
              </button>

              <button
                className="button ghost"
                onClick={() => setShowDuplicateModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <p className="hint">
        API endpoint: <span className="mono">{API_BASE}</span>
      </p>
    </main>
  );
}
