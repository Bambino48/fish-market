"use client";

import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

type LogoutButtonProps = {
    fullWidth?: boolean;
};

export default function LogoutButton({ fullWidth = false }: LogoutButtonProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    async function handleLogout() {
        try {
            setIsLoading(true);

            const response = await fetch("/api/logout", {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la déconnexion.");
            }

            toast.success("Déconnexion réussie.");

            router.push("/login");
            router.refresh();
        } catch (error) {
            toast.error("Impossible de se déconnecter pour le moment.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <button
            onClick={handleLogout}
            disabled={isLoading}
            className={`inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-70 ${fullWidth ? "w-full" : ""
                }`}
        >
            {isLoading ? (
                <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Déconnexion...
                </>
            ) : (
                <>
                    <LogOut className="h-4 w-4" />
                    Se déconnecter
                </>
            )}
        </button>
    );
}