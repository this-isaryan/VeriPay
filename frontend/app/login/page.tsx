"use client";

import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();

  function handleLogin(role: "submitter" | "reviewer") {
    login(role);
    router.push("/dashboard");
  }

  return (
    <main className="p-10 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">VeriPay Login</h1>

      <button
        className="w-full mb-3 p-2 bg-black text-white"
        onClick={() => handleLogin("submitter")}
      >
        Login as Submitter
      </button>

      <button
        className="w-full p-2 border"
        onClick={() => handleLogin("reviewer")}
      >
        Login as Reviewer
      </button>
    </main>
  );
}
