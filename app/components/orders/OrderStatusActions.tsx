"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type OrderStatusActionsProps = {
    orderId: number;
};

export default function OrderStatusActions({
    orderId,
}: OrderStatusActionsProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    async function updateStatus(status: "CONFIRMED" | "CANCELLED") {
        setLoading(true);
        setMessage("");

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
                setMessage(data.error || "Erreur lors de la mise à jour.");
                setLoading(false);
                return;
            }

            setMessage(
                status === "CONFIRMED"
                    ? "Commande confirmée."
                    : "Commande annulée."
            );

            router.refresh();
        } catch (error) {
            console.error(error);
            setMessage("Erreur réseau.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mt-4">
            <div className="flex gap-3 flex-wrap">
                <button
                    onClick={() => updateStatus("CONFIRMED")}
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                    Confirmer
                </button>

                <button
                    onClick={() => updateStatus("CANCELLED")}
                    disabled={loading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg"
                >
                    Refuser
                </button>
            </div>

            {message && <p className="mt-3">{message}</p>}
        </div>
    );
}