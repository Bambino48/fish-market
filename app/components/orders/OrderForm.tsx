"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Package, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

type OrderFormProps = {
    fishId: number;
    fishTitle: string;
};

export default function OrderForm({ fishId, fishTitle }: OrderFormProps) {
    const router = useRouter();
    const [quantity, setQuantity] = useState("1");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

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
                toast.error(data.error || "Erreur lors de la commande.");
                setLoading(false);
                return;
            }

            toast.success(`Commande créée pour ${fishTitle}.`);

            setTimeout(() => {
                router.push("/dashboard/orders");
                router.refresh();
            }, 1200);
        } catch (error) {
            console.error(error);
            toast.error("Erreur réseau.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="rounded-3xl bg-slate-50 p-5">
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                        <ShoppingCart className="h-5 w-5" />
                    </div>

                    <div>
                        <h4 className="text-base font-semibold text-slate-900">
                            Commander {fishTitle}
                        </h4>
                        <p className="mt-1 text-sm leading-6 text-slate-600">
                            Indiquez la quantité souhaitée puis validez votre commande.
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="quantity"
                    className="text-sm font-medium text-slate-700"
                >
                    Quantité à commander
                </label>

                <div className="relative max-w-xs">
                    <Package className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        id="quantity"
                        type="number"
                        min="1"
                        step="1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                        required
                    />
                </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-4">
                <p className="text-sm leading-6 text-slate-600">
                    Après validation, votre commande sera enregistrée et visible dans votre
                    espace acheteur.
                </p>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
                {loading ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Commande en cours...
                    </>
                ) : (
                    <>
                        <ShoppingCart className="h-4 w-4" />
                        Commander
                    </>
                )}
            </button>
        </form>
    );
}