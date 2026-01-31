"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isAuthRoute =
    pathname === "/login" || pathname === "/register";

  useEffect(() => {
    if (loading) return;

    // 🔒 Not logged in → block protected routes
    if (!user && !isAuthRoute) {
      router.replace("/login");
      return;
    }

    // 🚫 Logged in → block login/register
    if (user && isAuthRoute) {
      router.replace("/dashboard");
    }
  }, [user, loading, isAuthRoute, router]);

  // ⏳ Prevent flicker while checking auth
  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Checking authentication…
      </div>
    );
  }

  return <>{children}</>;
}
