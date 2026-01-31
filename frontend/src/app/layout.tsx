import type { Metadata } from "next";
import { Space_Grotesk, Source_Code_Pro } from "next/font/google";
import "./globals.css";
import AppShell from "./ui/AppShell";
import { AuthProvider } from "./context/AuthContext";
import RequireAuth from "./ui/RequireAuth";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VeriPay Auth",
  description: "Login and registration for the VeriPay system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${sourceCodePro.variable}`}>
        <AuthProvider>
          <AppShell>
            <RequireAuth>{children}</RequireAuth>
          </AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
