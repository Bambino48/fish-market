"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

type Props = {
    documentId: number;
};

export default function VerificationActions({ documentId }: Props) {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error" | "">("");

    async function updateStatus(status: "APPROVED" | "REJECTED") {
        setLoading(true);
        setMessage("");
        setMessageType("");

        try {
            const res = await fetch(`/api/admin/verifications/${documentId}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status }),
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage(data.error || "Erreur lors de la mise à jour.");
                setMessageType("error");
                return;
            }

            setMessage(
                status === "APPROVED"
                    ? "Compte approuvé avec succès."
                    : "Compte rejeté avec succès."
            );
            setMessageType("success");

            router.refresh();
        } catch (error) {
            console.error(error);
            setMessage("Erreur réseau.");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap gap-3">
                <button
                    type="button"
                    onClick={() => updateStatus("APPROVED")}
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <CheckCircle2 className="h-4 w-4" />
                    )}
                    Approuver
                </button>

                <button
                    type="button"
                    onClick={() => updateStatus("REJECTED")}
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <XCircle className="h-4 w-4" />
                    )}
                    Rejeter
                </button>
            </div>

            {message && (
                <div
                    className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${messageType === "success"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        }`}
                >
                    {message}
                </div>
            )}
        </div>
    );
}