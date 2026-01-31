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

  useEffect(() => {
    if (loading) return;

    const isAuthRoute =
      pathname === "/login" || pathname === "/register";

    if (!user && !isAuthRoute) {
      router.replace("/login");
    }

    if (user && isAuthRoute) {
      router.replace("/dashboard");
    }
  }, [user, loading, pathname, router]);

  if (loading) return null;

  return <>{children}</>;
}