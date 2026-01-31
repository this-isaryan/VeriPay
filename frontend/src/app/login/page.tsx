"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const router = useRouter();
  const { refresh } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("Signing in...");

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        setStatus(error.detail ?? "Login failed.");
        return;
      }

      const data = await response.json();
      setStatus(data.message ?? "Login successful.");
      await refresh();
      router.push("/dashboard");
    } catch (_error) {
      setStatus("Unable to reach the API.");
    }
  };

  return (
    <main className="page">
      <section className="panel">
        <span className="tag">Sign In</span>
        <h1 className="title">Welcome back.</h1>
        <p className="subtitle">
          Access the invoice risk dashboard with your verified credentials.
        </p>
      </section>

      <section className="card">
        <form className="form" onSubmit={handleSubmit}>
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
              placeholder="••••••••"
              required
            />
          </div>
          <div className="actions">
            <button className="button" type="submit">
              Login
            </button>
            <a className="button outline" href="/register">
              Create account
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
