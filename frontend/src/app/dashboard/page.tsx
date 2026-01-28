export default function DashboardPage() {
  return (
    <main className="page dashboard">
      <section className="panel">
        <span className="tag">Operations</span>
        <h1 className="title">Invoice integrity dashboard.</h1>
        <p className="subtitle">
          Track verifications, anomaly scores, and issuer trust signals across
          your finance workflow.
        </p>
      </section>

      <section className="grid dashboard-grid">
        <article className="card metric-card">
          <p className="metric-label">Invoices processed</p>
          <p className="metric-value">128</p>
          <p className="metric-trend">+14 this week</p>
        </article>
        <article className="card metric-card">
          <p className="metric-label">High-risk flags</p>
          <p className="metric-value">6</p>
          <p className="metric-trend">2 require review</p>
        </article>
        <article className="card metric-card">
          <p className="metric-label">Trusted issuers</p>
          <p className="metric-value">42</p>
          <p className="metric-trend">98% verified</p>
        </article>
        <article className="card metric-card">
          <p className="metric-label">Avg. turnaround</p>
          <p className="metric-value">3.2m</p>
          <p className="metric-trend">-18% vs last month</p>
        </article>
      </section>

      <section className="grid">
        <article className="card">
          <h3>Live verification queue</h3>
          <ul className="activity-list">
            <li className="activity-item">
              <div>
                <p className="activity-title">ACME Hardware</p>
                <p className="activity-meta">INV-4012 • 2m ago</p>
              </div>
              <span className="pill warning">Review</span>
            </li>
            <li className="activity-item">
              <div>
                <p className="activity-title">Juniper Labs</p>
                <p className="activity-meta">INV-4029 • 7m ago</p>
              </div>
              <span className="pill success">Approved</span>
            </li>
            <li className="activity-item">
              <div>
                <p className="activity-title">Orchid Supply</p>
                <p className="activity-meta">INV-3991 • 15m ago</p>
              </div>
              <span className="pill danger">Escalate</span>
            </li>
          </ul>
        </article>

        <article className="card">
          <h3>Issuer trust distribution</h3>
          <div className="progress-list">
            <div className="progress-row">
              <div className="progress-head">
                <span>Verified issuers</span>
                <span>76%</span>
              </div>
              <div className="progress-bar">
                <span style={{ width: "76%" }} />
              </div>
            </div>
            <div className="progress-row">
              <div className="progress-head">
                <span>Pending checks</span>
                <span>18%</span>
              </div>
              <div className="progress-bar">
                <span style={{ width: "18%" }} />
              </div>
            </div>
            <div className="progress-row">
              <div className="progress-head">
                <span>High-risk issuers</span>
                <span>6%</span>
              </div>
              <div className="progress-bar">
                <span style={{ width: "6%" }} />
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="card">
        <h3>Next actions</h3>
        <p className="subtitle">
          Keep your verification loop tight by triaging flagged invoices and
          generating compliance-ready summaries.
        </p>
        <div className="dashboard-actions">
          <button className="button" type="button">
            Start verification
          </button>
          <button className="button outline" type="button">
            Export compliance report
          </button>
        </div>
        <p className="notice">
          3 invoices are awaiting manual review with anomaly scores above 0.7.
        </p>
      </section>
    </main>
  );
}
