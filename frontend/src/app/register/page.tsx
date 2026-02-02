"use client";

import { useState } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("Creating your account...");

    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          email,
          password,
        }),
      });

      if (!response.ok) {
        const error = await response.json();

        if (Array.isArray(error.detail)) {
          setStatus(error.detail.map((e: any) => e.msg).join(", "));
        } else {
          setStatus(error.detail ?? "Registration failed.");
        }

        return;
      }


      const data = await response.json();
      setStatus(data.message ?? "Account created.");
    } catch (_error) {
      setStatus("Unable to reach the API.");
    }
  };

  return (
    <main className="page">
      <section className="panel">
        <span className="tag">Register</span>
        <h1 className="title">Create your access profile.</h1>
        <p className="subtitle">
          Register once to begin verifying invoices across your finance
          workflows.
        </p>
      </section>

      <section className="card">
        <form className="form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="fullName">Full name</label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Jordan Rivers"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@veripay.io"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Create a strong password"
              minLength={8}
              required
            />
          </div>
          <div className="actions">
            <button className="button" type="submit">
              Register
            </button>
            <a className="button outline" href="/login">
              I already have an account
            </a>
          </div>
          {status ? <p className="status">{status}</p> : null}
        </form>
      </section>
      <p className="hint">
        API endpoint: <span className="mono">{API_BASE}</span>
      </p>
    </main>
  );
}
