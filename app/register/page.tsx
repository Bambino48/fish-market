"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        password: "",
        role: "BUYER",
        city: "San Pedro",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage(data.error || "Erreur lors de l'inscription.");
                setLoading(false);
                return;
            }

            setMessage("Compte créé avec succès. Redirection vers la connexion...");
            setTimeout(() => {
                router.push("/login");
            }, 1500);
        } catch (error) {
            console.error(error);
            setMessage("Erreur réseau.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="max-w-xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">Créer un compte</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="name"
                    placeholder="Nom complet"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                    required
                />

                <input
                    type="text"
                    name="phone"
                    placeholder="Téléphone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email (optionnel)"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Mot de passe"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                    required
                />

                <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                >
                    <option value="BUYER">Acheteur</option>
                    <option value="SELLER">Vendeur</option>
                </select>

                <input
                    type="text"
                    name="city"
                    placeholder="Ville"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white rounded-lg p-3"
                >
                    {loading ? "Création..." : "Créer mon compte"}
                </button>
            </form>

            {message && <p className="mt-4">{message}</p>}
        </main>
    );
}