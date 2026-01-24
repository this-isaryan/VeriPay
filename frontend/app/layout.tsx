import "../styles/globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "VeriPay",
  description: "Invoice Verification System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="max-w-6xl mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}