"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

type BuyerOrderActionsProps = {
    orderId: number;
    currentQuantity: number;
};

export default function BuyerOrderActions({
    orderId,
    currentQuantity,
}: BuyerOrderActionsProps) {
    const router = useRouter();
    const [loadingAction, setLoadingAction] = useState<"update" | "delete" | null>(null);

    async function updateQuantity(newQuantity: number) {
        if (newQuantity <= 0) return;

        setLoadingAction("update");

        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ quantity: newQuantity }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Erreur lors de la mise à jour.");
                return;
            }

            toast.success("Commande mise à jour.");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Erreur réseau.");
        } finally {
            setLoadingAction(null);
        }
    }

    async function deleteOrder() {
        const confirmed = window.confirm(
            "Voulez-vous vraiment supprimer cette commande ?"
        );

        if (!confirmed) return;

        setLoadingAction("delete");

        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Erreur lors de la suppression.");
                return;
            }

            toast.success("Commande supprimée.");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Erreur réseau.");
        } finally {
            setLoadingAction(null);
        }
    }

    return (
        <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap gap-3">
                <button
                    type="button"
                    onClick={() => updateQuantity(currentQuantity - 1)}
                    disabled={loadingAction !== null || currentQuantity <= 1}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 disabled:opacity-60"
                >
                    {loadingAction === "update" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Minus className="h-4 w-4" />
                    )}
                    Diminuer
                </button>

                <button
                    type="button"
                    onClick={() => updateQuantity(currentQuantity + 1)}
                    disabled={loadingAction !== null}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 disabled:opacity-60"
                >
                    {loadingAction === "update" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Plus className="h-4 w-4" />
                    )}
                    Augmenter
                </button>

                <button
                    type="button"
                    onClick={deleteOrder}
                    disabled={loadingAction !== null}
                    className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                >
                    {loadingAction === "delete" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Trash2 className="h-4 w-4" />
                    )}
                    Supprimer
                </button>
            </div>
        </div>
    );
}