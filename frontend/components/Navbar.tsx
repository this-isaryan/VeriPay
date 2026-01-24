"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAuthFromCookie, logout } from "@/lib/auth";

export default function Navbar() {
  const router = useRouter();
  const auth = getAuthFromCookie();

  if (!auth) return null;

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <nav className="border-b mb-6">
      <div className="max-w-6xl mx-auto p-4 flex gap-6 items-center">
        <span className="font-bold">VeriPay</span>

        <Link href="/dashboard">Dashboard</Link>
        <Link href="/invoices/upload">Upload Invoice</Link>

        {auth.role === "reviewer" && (
          <Link href="/review">Review</Link>
        )}

        <div className="ml-auto">
          <button
            onClick={handleLogout}
            className="text-sm text-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
