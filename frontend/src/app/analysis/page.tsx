"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

type InvoiceSummary = {
  invoice_id: number;
  status: string;
  file_hash: string;
  is_signed: boolean;
  crypto_valid: boolean | null;
  signer_fingerprint: string | null;
  created_at: string;
};

type AnalysisResult = {
  invoice_id: number;
  file_type: string;
  crypto: {
    signature_present: boolean;
    signature_integrity: string;
    certificate_trust: string;
    signer_fingerprint: string | null;
    vendor_status?: string;
    signer_identity?: string;
  };
  ai: {
    status: string;
    message?: string;
    anomaly_score?: number;
    risk_level?: string;
    review_required?: boolean;
    embedding_distance?: number;
    distance_z_score?: number;
    explanations?: string[];
  };
  rules: {
    status: string;
    message?: string;
    word_count?: number;
    font_count?: number;
    fonts?: string[];
    line_item_count?: number;
    line_item_sum?: number | null;
    subtotal?: number | null;
    tax?: number | null;
    total?: number | null;
    checks?: {
      subtotal_matches_items?: boolean | null;
      subtotal_delta?: number | null;
      total_matches_subtotal_tax?: boolean | null;
      total_delta?: number | null;
    };
  };
};

export default function AnalysisPage() {
  const searchParams = useSearchParams();
  const presetId = searchParams.get("invoiceId");
  const autoRun = searchParams.get("run") === "1";

  const [invoices, setInvoices] = useState<InvoiceSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string>(presetId ?? "");
  const [status, setStatus] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [autoRunTriggered, setAutoRunTriggered] = useState(false);

  const canAnalyze = useMemo(() => selectedId.trim().length > 0, [selectedId]);

  const aiStatusLabel = () => {
    if (!result) return null;

    if (result.ai.status === "ok") {
      return <span className="pill success">AI analysis complete</span>;
    }

    if (result.ai.status === "skipped") {
      return <span className="pill warning">AI not applicable</span>;
    }

    return <span className="pill danger">AI analysis failed</span>;
  };


  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const response = await fetch(`${API_BASE}/invoices/`, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Unable to load invoices");
        }
        const data = (await response.json()) as InvoiceSummary[];
        setInvoices(data);
      } catch (_error) {
        setStatus("Unable to fetch invoices from the API.");
      }
    };

    loadInvoices();
  }, []);

  useEffect(() => {
    if (!presetId) {
      return;
    }
    setSelectedId(presetId);
  }, [presetId]);

  useEffect(() => {
    if (!autoRun || autoRunTriggered || !selectedId) {
      return;
    }
    setAutoRunTriggered(true);
    handleAnalyze();
  }, [autoRun, autoRunTriggered, selectedId]);

  const handleAnalyze = async () => {
    if (!canAnalyze) {
      setStatus("Select or enter an invoice ID to analyze.");
      return;
    }

    try {
      setIsRunning(true);
      setStatus("Running analysis...");
      setResult(null);

      const response = await fetch(
        `${API_BASE}/invoices/${selectedId}/analyze`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      let data: AnalysisResult | null = null;
      try {
        data = (await response.json()) as AnalysisResult;
      } catch {
        data = null;
      }

      if (response.status === 401) {
        setStatus("Session expired. Please log in again.");
        return;
      }

      if (!response.ok) {
        setStatus(data?.ai?.message ?? "Analysis failed.");
        setIsRunning(false);
        return;
      }

      setResult(data);
      setStatus("Analysis complete.");
      setIsRunning(false);
    } catch (_error) {
      setStatus("Unable to reach the API.");
      setIsRunning(false);
    }
  };

  return (
    <main className="page">
      <section className="panel">
        <span className="tag">Analysis</span>
        <h1 className="title">Analyze uploaded invoices.</h1>
        <p className="subtitle">
          Select an invoice, run crypto verification, and review AI anomaly
          signals in one place.
        </p>
      </section>

      <section className="card">
        <div className="field">
          <label htmlFor="invoiceId">Invoice ID</label>
          <input
            id="invoiceId"
            value={selectedId}
            onChange={(event) => setSelectedId(event.target.value)}
            placeholder="Enter invoice ID"
          />
        </div>
        <div className="field">
          <label htmlFor="invoiceList">Choose from uploads</label>
          <select
            id="invoiceList"
            value={selectedId}
            onChange={(event) => setSelectedId(event.target.value)}
          >
            <option value="">Select invoice</option>
            {invoices.map((invoice) => (
              <option key={invoice.invoice_id} value={invoice.invoice_id}>
                #{invoice.invoice_id} • {invoice.status} •{" "}
                {invoice.created_at?.slice(0, 10)}
              </option>
            ))}
          </select>
        </div>
        <div className="actions">
          <button
            className="button"
            type="button"
            onClick={handleAnalyze}
            disabled={isRunning}
          >
            {isRunning ? "Analyzing..." : "Run analysis"}
          </button>
          <span className="hint">
            PDF invoices include signature verification and AI scoring.
          </span>
        </div>
        {selectedId && (
          <p className="hint">
            Selected invoice: <span className="mono">#{selectedId}</span>
          </p>
        )}
        {status ? <p className="status">{status}</p> : null}
      </section>

      {result ? (
        <section className="grid analysis-grid">
          <article className="card">
            <h3>Cryptographic verification</h3>
            <div className="analysis-list">
              <div>
                <p className="metric-label">Signature present</p>
                <p className="metric-value">
                  {String(result.crypto.signature_present)}
                </p>
              </div>
              <div>
                <p className="metric-label">Signature integrity</p>
                <p className="metric-value">{result.crypto.signature_integrity}</p>
              </div>
              <div>
                <p className="metric-label">Certificate trust</p>
                <p className="metric-value">{result.crypto.certificate_trust}</p>
              </div>
            </div>
            {result.crypto.signer_fingerprint ? (
              <div className="upload-meta">
                <p className="metric-label">Signer fingerprint</p>
                <p className="mono">{result.crypto.signer_fingerprint}</p>
              </div>
            ) : null}
          </article>

          <article className="card">
            <h3>
              AI anomaly analysis{" "}
              {aiStatusLabel()}
            </h3>
            {result.ai.status !== "ok" ? (
              <p className="status">{result.ai.message ?? "AI analysis did not return a usable result."}</p>

            ) : (
              <div className="analysis-list">
                <div>
                  <p className="metric-label">Anomaly score</p>
                  <p className="metric-value">{result.ai.anomaly_score}</p>
                </div>
                <div>
                  <p className="metric-label">Risk level</p>
                  <p className="metric-value">{result.ai.risk_level}</p>
                </div>
                <div>
                  <p className="metric-label">Review required</p>
                  <p className="metric-value">{String(result.ai.review_required)}</p>
                </div>
                <div>
                  <p className="metric-label">Embedding distance</p>
                  <p className="metric-value">{result.ai.embedding_distance}</p>
                </div>
                <div>
                  <p className="metric-label">Distance z-score</p>
                  <p className="metric-value">{result.ai.distance_z_score}</p>
                </div>
              </div>
            )}
            {result.ai.explanations?.length ? (
              <ul className="analysis-notes">
                {result.ai.explanations.map((note, idx) => (
                  <li key={`${idx}-${note}`}>{note}</li>
                ))}
              </ul>
            ) : null}
          </article>

          <article className="card">
            <h3>Rule-based checks</h3>
            {result.rules.status !== "ok" ? (
              <p className="status">
                {result.rules.message ?? `Rules status: ${result.rules.status}`}
              </p>
            ) : null}
            <div className="analysis-list">
              <div>
                <p className="metric-label">Word count</p>
                <p className="metric-value">{result.rules.word_count ?? "N/A"}</p>
              </div>
              <div>
                <p className="metric-label">Font count</p>
                <p className="metric-value">{result.rules.font_count ?? "N/A"}</p>
              </div>
              <div>
                <p className="metric-label">Line items</p>
                <p className="metric-value">
                  {result.rules.line_item_count ?? "N/A"}
                </p>
              </div>
              <div>
                <p className="metric-label">Line item sum</p>
                <p className="metric-value">
                  {result.rules.line_item_sum ?? "N/A"}
                </p>
              </div>
              <div>
                <p className="metric-label">Subtotal</p>
                <p className="metric-value">{result.rules.subtotal ?? "N/A"}</p>
              </div>
              <div>
                <p className="metric-label">Tax</p>
                <p className="metric-value">{result.rules.tax ?? "N/A"}</p>
              </div>
              <div>
                <p className="metric-label">Total</p>
                <p className="metric-value">{result.rules.total ?? "N/A"}</p>
              </div>
            </div>
            {result.rules.checks ? (
              <ul className="analysis-notes">
                <li>
                  Subtotal vs items:{" "}
                  {String(result.rules.checks.subtotal_matches_items)}
                </li>
                <li>
                  Total vs subtotal+tax:{" "}
                  {String(result.rules.checks.total_matches_subtotal_tax)}
                </li>
                <li>
                  Subtotal delta: {result.rules.checks.subtotal_delta ?? "N/A"}
                </li>
                <li>
                  Total delta: {result.rules.checks.total_delta ?? "N/A"}
                </li>
              </ul>
            ) : null}
          </article>
        </section>
      ) : (
        <section className="card">
          <p className="subtitle">
            Select an invoice and click <strong>Run analysis</strong> to view
            cryptographic verification, AI anomaly scores, and rule-based checks.
          </p>
        </section>
      )}

      <p className="hint">
        API endpoint: <span className="mono">{API_BASE}</span>
      </p>
    </main>
  );
}
