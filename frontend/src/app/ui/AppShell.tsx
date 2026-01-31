"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const USER_KEY = "veripay.userEmail";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userEmail, setUserEmail] = useState<string>("Guest");
  const router = useRouter();
  const pathname = usePathname();

  const isLoggedIn = userEmail !== "Guest";

  useEffect(() => {
    const syncUser = () => {
      const stored = window.localStorage.getItem(USER_KEY);
      if (stored && stored.trim()) {
        setUserEmail(stored);
      } else {
        setUserEmail("Guest");
      }
    };

    syncUser();

    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  const handleLogout = () => {
    window.localStorage.removeItem(USER_KEY);
    setUserEmail("Guest");
    router.push("/login");
  };

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

          {!isLoggedIn && (
            <>
              <Link href="/login" className="nav-link">Login</Link>
              <Link href="/register" className="nav-link">Register</Link>
            </>
          )}
        </nav>

      </aside>

      <div className="shell-main">
        <header className="topbar">
          <div className="topbar-left">
            <p className="topbar-label">Signed in</p>
            <p className="topbar-user">{userEmail}</p>
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
            {!isLoggedIn ? (
              <>
                <Link href="/login" className="topbar-link">Sign in</Link>
                <Link href="/register" className="topbar-link">Create user</Link>
              </>
            ) : (
              <button
                className="topbar-link logout"
                type="button"
                onClick={handleLogout}
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
