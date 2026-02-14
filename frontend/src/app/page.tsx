"use client"

import Link from "next/link"
import { useAuth } from "@/app/context/AuthContext"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ShieldCheck,
  Brain,
  ClipboardCheck,
  ArrowRight,
} from "lucide-react"

export default function Home() {
  const { user } = useAuth()
  const isAuthenticated = !!user

  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center px-6 py-20">
      {/* Subtle radial glow */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/[0.05] blur-3xl" />

      <div className="relative w-full max-w-6xl flex flex-col gap-16">
        {/* ---------------- HERO ---------------- */}
        <section className="flex flex-col items-center gap-6 text-center">
          <Badge
            variant="secondary"
            className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
          >
            VeriPay Platform
          </Badge>

          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground lg:text-5xl">
            Secure invoice verification built for modern finance teams.
          </h1>

          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground lg:text-base">
            Verify digital signatures, detect anomalies, and maintain
            audit-ready trails — all within a single AI-powered workflow.
          </p>

          {/* Conditional CTA */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button className="gap-2">
                  Go to dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button>Login</Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline">Create account</Button>
                </Link>
              </>
            )}
          </div>
        </section>

        {/* ---------------- FEATURES GRID ---------------- */}
        <section className="grid gap-6 md:grid-cols-3">
          {/* Identity-first */}
          <Card className="border-0 bg-card/65 shadow-sm backdrop-blur-xl">
            <CardContent className="flex flex-col gap-4 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">
                Identity-first access
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Every session is tied to a verified operator profile with secure,
                hashed credentials stored in PostgreSQL.
              </p>
            </CardContent>
          </Card>

          {/* AI anomaly */}
          <Card className="border-0 bg-card/65 shadow-sm backdrop-blur-xl">
            <CardContent className="flex flex-col gap-4 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">
                AI-powered anomaly detection
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Detect unusual formatting patterns, suspicious totals, and
                document drift using vector embeddings and statistical scoring.
              </p>
            </CardContent>
          </Card>

          {/* Audit trail */}
          <Card className="border-0 bg-card/65 shadow-sm backdrop-blur-xl">
            <CardContent className="flex flex-col gap-4 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <ClipboardCheck className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">
                Audit-ready compliance
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Log every upload, verification result, and decision for
                compliance reporting and future dispute resolution.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* ---------------- FOOTER NOTE ---------------- */}
        <section className="flex flex-col items-center gap-2 text-center text-xs text-muted-foreground">
          <p>
            Built with secure authentication, cryptographic validation, and
            AI-driven risk analysis.
          </p>
          <p className="font-mono text-foreground/70">
            Enterprise-ready document verification.
          </p>
        </section>
      </div>
    </main>
  )
}
