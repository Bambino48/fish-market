"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type OrderFormProps = {
    fishId: number;
    fishTitle: string;
};

export default function OrderForm({ fishId, fishTitle }: OrderFormProps) {
    const router = useRouter();
    const [quantity, setQuantity] = useState("1");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fishId,
                    quantity: Number(quantity),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage(data.error || "Erreur lors de la commande.");
                setLoading(false);
                return;
            }

            setMessage(`Commande créée pour ${fishTitle}.`);
            setTimeout(() => {
                router.push("/dashboard/orders");
                router.refresh();
            }, 1200);
        } catch (error) {
            console.error(error);
            setMessage("Erreur réseau.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
                <label className="block mb-2 font-medium">Quantité à commander</label>
                <input
                    type="number"
                    min="1"
                    step="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full max-w-xs border rounded-lg p-3"
                    required
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="px-5 py-3 bg-green-600 text-white rounded-lg"
            >
                {loading ? "Commande en cours..." : "Commander"}
            </button>

            {message && <p>{message}</p>}
        </form>
    );
}