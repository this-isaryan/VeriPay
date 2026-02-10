import React from "react"
import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Source_Code_Pro } from "next/font/google";
import "./globals.css";
import AppShell from "./ui/AppShell";
import { AuthProvider } from "./context/AuthContext";
import RequireAuth from "./ui/RequireAuth";
import { ThemeProvider } from "@/components/theme-provider"

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VeriPay — AI Invoice Verification",
  description:
    "Track verifications, anomaly scores, and issuer trust signals across your finance workflow.",
}

export const viewport: Viewport = {
  themeColor: "#1f5e5b",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${sourceCodePro.variable}`}>
        <ThemeProvider attribute="class"
          defaultTheme="system"
          enableSystem>
          <AuthProvider>
            <AppShell>
              <RequireAuth>{children}</RequireAuth>
            </AppShell>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
