"use client";

import { useState } from "react";

export default function VendorRegisterPage() {
    const [vendorName, setVendorName] = useState("");
    const [certificate, setCertificate] = useState<File | null>(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);

        if (!certificate) {
            setError("Please upload a certificate file");
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append("vendor_name", vendorName);
            formData.append("certificate", certificate);

            const response = await fetch("http://localhost:8000/vendors/", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.detail || "Failed to register vendor");
            } else {
                setMessage("Vendor registered successfully");
                setVendorName("");
                setCertificate(null);
            }
        } catch {
            setError("Backend not reachable");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 sm:p-8">
                <h1 className="text-xl text-black sm:text-2xl font-semibold text-center mb-2">
                    Vendor Registration
                </h1>
                <p className="text-sm text-black text-center mb-6">
                    Upload your signing certificate to register as a vendor
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-black mb-1">
                            Vendor Name
                        </label>
                        <input
                            type="text"
                            value={vendorName}
                            onChange={(e) => setVendorName(e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black
                            focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-black mb-1">
                            Certificate File (.cer / .pem)
                        </label>
                        <input
                            type="file"
                            accept=".cer,.pem"
                            onChange={(e) => setCertificate(e.target.files?.[0] || null)}
                            className="w-full text-sm text-black"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-md bg-black text-white py-2 text-sm font-medium
                       hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed transition"
                    >
                        {loading ? "Registering..." : "Register Vendor"}
                    </button>
                </form>

                {message && (
                    <p className="mt-4 text-center text-sm text-green-600">{message}</p>
                )}
                {error && (
                    <p className="mt-4 text-center text-sm text-red-600">{error}</p>
                )}
            </div>
        </main>
    );
}
