"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ phone, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage(data.error || "Erreur de connexion.");
                setLoading(false);
                return;
            }

            setMessage("Connexion réussie.");
            router.push("/dashboard");
            router.refresh();
        } catch (error) {
            console.error(error);
            setMessage("Erreur réseau.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="max-w-xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">Connexion</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Téléphone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border rounded-lg p-3"
                    required
                />

                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border rounded-lg p-3"
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white rounded-lg p-3"
                >
                    {loading ? "Connexion..." : "Se connecter"}
                </button>
            </form>

            {message && <p className="mt-4">{message}</p>}
        </main>
    );
}