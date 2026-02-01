"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, refresh } = useAuth();
  const hideShell = pathname === "/login" || pathname === "/register";

  if (hideShell) {
    return <div className="app-shell auth-shell">{children}</div>;
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <img src="/veripay-logo.svg" alt="VeriPay logo" />
          </div>
          <div className="sidebar-brand-text">
            <p className="sidebar-kicker">VeriPay</p>
            <p className="sidebar-title">Verification</p>
          </div>
        </div>
        <nav className="sidebar-nav">
          <Link
            href="/dashboard"
            className={`nav-link ${pathname === "/dashboard" ? "active" : ""}`}
          >
            Dashboard
          </Link>
          <Link
            href="/upload"
            className={`nav-link ${pathname === "/upload" ? "active" : ""}`}
          >
            Upload invoices
          </Link>
          <Link
            href="/analysis"
            className={`nav-link ${pathname === "/analysis" ? "active" : ""}`}
          >
            Analysis
          </Link>
          {!loading && !user && (
            <>
              <Link href="/login" className="topbar-link">Login</Link>
              <Link href="/register" className="topbar-link">Register</Link>
            </>
          )}
        </nav>

      </aside>

      <div className="shell-main">
        <header className="topbar">
          <div className="topbar-left">
            <p className="topbar-label">Signed in</p>
            <p className="topbar-user">
              {user ? user.full_name || user.email : ""}
            </p>
          </div>
          <nav className="topbar-nav">
            <Link href="/dashboard" className="topbar-link">
              Overview
            </Link>
            <Link href="/upload" className="topbar-link">
              Upload
            </Link>
            <Link href="/analysis" className="topbar-link">
              Analysis
            </Link>
            {!loading && user && (
              <button
                className="topbar-link logout"
                type="button"
                onClick={async () => {
                  await fetch(`${API_BASE}/auth/logout`, {
                    method: "POST",
                    credentials: "include",
                  });
                  await refresh();
                  router.push("/login");
                }}
              >
                Logout
              </button>
            )}
          </nav>
        </header>
        <div className="shell-content">{children}</div>
      </div>
    </div>
  );
}
