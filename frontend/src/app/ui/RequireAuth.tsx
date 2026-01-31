"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const USER_KEY = "veripay.userEmail";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const user = window.localStorage.getItem(USER_KEY);

    const isAuthRoute =
      pathname === "/login" || pathname === "/register";

    if (!user && !isAuthRoute) {
      router.replace("/login");
      return;
    }

    setChecked(true);
  }, [pathname, router]);

  if (!checked) return null;

  return <>{children}</>;
}