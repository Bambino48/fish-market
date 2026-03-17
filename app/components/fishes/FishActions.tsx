"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PencilLine, Trash2, ToggleLeft, ToggleRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

type FishActionsProps = {
    fishId: number;
    currentAvailable: boolean;
    title: string;
    species: string;
    description: string | null;
    price: number;
    quantity: number;
    unit: "KG" | "CARTON" | "PIECE";
    imageUrl: string | null;
    location: string | null;
};

export default function FishActions({
    fishId,
    currentAvailable,
    title,
    species,
    description,
    price,
    quantity,
    unit,
    imageUrl,
    location,
}: FishActionsProps) {
    const router = useRouter();
    const [loadingAction, setLoadingAction] = useState<"toggle" | "delete" | null>(null);

    async function handleToggleAvailability() {
        setLoadingAction("toggle");

        try {
            const res = await fetch(`/api/fishes/${fishId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    species,
                    description,
                    price,
                    quantity,
                    unit,
                    imageUrl,
                    location,
                    available: !currentAvailable,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Erreur lors de la mise à jour.");
                return;
            }

            toast.success(
                !currentAvailable ? "Annonce rendue disponible." : "Annonce rendue indisponible."
            );
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Erreur réseau.");
        } finally {
            setLoadingAction(null);
        }
    }

    async function handleDelete() {
        const confirmed = window.confirm(
            "Voulez-vous vraiment supprimer cette annonce ?"
        );

        if (!confirmed) return;

        setLoadingAction("delete");

        try {
            const res = await fetch(`/api/fishes/${fishId}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Erreur lors de la suppression.");
                return;
            }

            toast.success("Annonce supprimée avec succès.");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Erreur réseau.");
        } finally {
            setLoadingAction(null);
        }
    }

    return (
        <div className="mt-5 flex flex-wrap gap-3">
            <Link
                href={`/dashboard/fishes/${fishId}/edit`}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
            >
                <PencilLine className="h-4 w-4" />
                Modifier
            </Link>

            <button
                type="button"
                onClick={handleToggleAvailability}
                disabled={loadingAction !== null}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 disabled:opacity-70"
            >
                {loadingAction === "toggle" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : currentAvailable ? (
                    <ToggleRight className="h-4 w-4" />
                ) : (
                    <ToggleLeft className="h-4 w-4" />
                )}
                {currentAvailable ? "Rendre indisponible" : "Rendre disponible"}
            </button>

            <button
                type="button"
                onClick={handleDelete}
                disabled={loadingAction !== null}
                className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-70"
            >
                {loadingAction === "delete" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Trash2 className="h-4 w-4" />
                )}
                Supprimer
            </button>
        </div>
    );
}