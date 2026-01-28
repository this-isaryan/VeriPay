export default function Home() {
  return (
    <main className="page">
      <section className="hero">
        <span className="tag">VeriPay Access</span>
        <h1 className="title">Secure invoice verification starts here.</h1>
        <p className="subtitle">
          Sign in to review issuer-bound invoices or create a new account to
          access fraud signals, anomaly checks, and audit-ready history.
        </p>
        <div className="actions">
          <a className="button" href="/login">
            Login
          </a>
          <a className="button outline" href="/register">
            Register
          </a>
        </div>
      </section>

      <section className="grid">
        <article className="card">
          <h3>Identity-first access</h3>
          <p>
            Every session is tied to a verified operator profile with secure,
            hashed credentials stored in PostgreSQL.
          </p>
        </article>
        <article className="card">
          <h3>Live verification</h3>
          <p>
            Review invoices against layout fingerprints and anomaly thresholds
            from the AI pipeline.
          </p>
        </article>
        <article className="card">
          <h3>Audit-ready trail</h3>
          <p>
            Log every login, review, and decision for compliance reporting and
            future dispute resolution.
          </p>
        </article>
      </section>
    </main>
  );
}
