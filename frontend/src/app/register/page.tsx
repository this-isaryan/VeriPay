"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Shield } from "lucide-react"

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000"

export default function RegisterPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [status, setStatus] = useState("")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus("Creating your account...")

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
      })

      if (!response.ok) {
        const error = await response.json()
        if (Array.isArray(error.detail)) {
          setStatus(error.detail.map((e: any) => e.msg).join(", "))
        } else {
          setStatus(error.detail ?? "Registration failed.")
        }
        return
      }

      const data = await response.json()
      setStatus(data.message ?? "Account created successfully.")
    } catch {
      setStatus("Unable to reach the API.")
    }
  }

  return (
    <main className="relative flex min-h-svh items-center justify-center p-4">
      {/* Background glow (same as login) */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="
            absolute left-1/2 top-0
            h-[600px] w-[800px]
            -translate-x-1/2 -translate-y-1/2
            rounded-full
            bg-foreground/[0.04]
            blur-3xl
            dark:bg-primary/[0.12]
            motion-safe:animate-glow-in
          "
        />
        <div
          className="
            absolute left-1/2 top-24
            h-[400px] w-[600px]
            -translate-x-1/2
            rounded-full
            bg-primary/[0.06]
            blur-2xl
            dark:bg-primary/[0.16]
            motion-safe:animate-glow-in
          "
        />
      </div>

      <div className="relative w-full max-w-[400px]">
        <Card
          className="
            border-border/40
            bg-card/65
            backdrop-blur-xl
            shadow-2xl shadow-background/80
            motion-safe:animate-in
            motion-safe:fade-in
            motion-safe:zoom-in-95
            duration-300
          "
        >
          <CardHeader className="items-center gap-3 pb-2 pt-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <CardTitle className="text-xl font-semibold tracking-tight text-foreground">
                Create your VeriPay account
              </CardTitle>
              <CardDescription className="text-center text-sm text-muted-foreground">
                Get started with AI-powered invoice verification
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="px-7 pb-2 pt-4">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">
                  Full name
                </label>
                <input
                  className="h-10 rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jordan Rivers"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">
                  Email
                </label>
                <input
                  type="email"
                  className="h-10 rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@veripay.io"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">
                  Password
                </label>
                <input
                  type="password"
                  className="h-10 rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  minLength={8}
                  required
                />
              </div>

              <button
                type="submit"
                className="
                  mt-2 h-10
                  rounded-md
                  bg-primary
                  text-sm font-medium
                  text-primary-foreground
                  transition-all
                  hover:bg-primary/90
                  active:scale-[0.98]
                "
              >
                Create account
              </button>

              {status && (
                <p className="text-sm text-muted-foreground">{status}</p>
              )}
            </form>
          </CardContent>

          <CardFooter className="justify-center pb-8 pt-4">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-foreground transition-colors hover:text-foreground/80"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}