"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";

type OrderStatusActionsProps = {
    orderId: number;
};

export default function OrderStatusActions({
    orderId,
}: OrderStatusActionsProps) {
    const router = useRouter();
    const [loadingStatus, setLoadingStatus] = useState<
        "CONFIRMED" | "CANCELLED" | "COMPLETED" | null
    >(null);

    async function updateStatus(status: "CONFIRMED" | "CANCELLED" | "COMPLETED") {
        setLoadingStatus(status);

        try {
            const res = await fetch(`/api/orders/${orderId}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Erreur lors de la mise à jour.");
                setLoadingStatus(null);
                return;
            }

            toast.success(
                status === "CONFIRMED"
                    ? "Commande confirmée."
                    : status === "CANCELLED"
                        ? "Commande annulée."
                        : "Commande marquée comme terminée."
            );

            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Erreur réseau.");
        } finally {
            setLoadingStatus(null);
        }
    }

    const isLoading = loadingStatus !== null;

    return (
        <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-4">
            <div className="flex flex-col gap-3 sm:flex-row">
                <button
                    type="button"
                    onClick={() => updateStatus("CONFIRMED")}
                    disabled={isLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {loadingStatus === "CONFIRMED" ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Confirmation...
                        </>
                    ) : (
                        <>
                            <CheckCircle2 className="h-4 w-4" />
                            Confirmer
                        </>
                    )}
                </button>

                <button
                    type="button"
                    onClick={() => updateStatus("CANCELLED")}
                    disabled={isLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {loadingStatus === "CANCELLED" ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Annulation...
                        </>
                    ) : (
                        <>
                            <XCircle className="h-4 w-4" />
                            Refuser
                        </>
                    )}
                </button>
                <button
                    type="button"
                    onClick={() => updateStatus("COMPLETED")}
                    disabled={isLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {loadingStatus === "COMPLETED" ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Finalisation...
                        </>
                    ) : (
                        <>
                            <CheckCircle2 className="h-4 w-4" />
                            Terminer
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}