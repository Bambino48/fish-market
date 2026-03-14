"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewFishForm() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: "",
        species: "",
        description: "",
        price: "",
        quantity: "",
        unit: "KG",
        imageUrl: "",
        location: "San Pedro",
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("/api/fishes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage(data.error || "Erreur lors de l'ajout.");
                setLoading(false);
                return;
            }

            setMessage("Poisson ajouté avec succès.");
            setTimeout(() => {
                router.push("/dashboard/fishes");
                router.refresh();
            }, 1000);
        } catch (error) {
            console.error(error);
            setMessage("Erreur réseau.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                name="title"
                placeholder="Titre de l'annonce"
                value={formData.title}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                required
            />

            <input
                type="text"
                name="species"
                placeholder="Espèce (ex: Thon, Capitaine, Crevette)"
                value={formData.species}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                required
            />

            <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                rows={4}
            />

            <input
                type="number"
                name="price"
                placeholder="Prix"
                value={formData.price}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                required
            />

            <input
                type="number"
                name="quantity"
                placeholder="Quantité"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                required
            />

            <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
            >
                <option value="KG">Kilogramme (KG)</option>
                <option value="CARTON">Carton</option>
                <option value="PIECE">Pièce</option>
            </select>

            <input
                type="text"
                name="imageUrl"
                placeholder="URL image (optionnel)"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
            />

            <input
                type="text"
                name="location"
                placeholder="Lieu"
                value={formData.location}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
            />

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white rounded-lg p-3"
            >
                {loading ? "Enregistrement..." : "Publier le poisson"}
            </button>

            {message && <p className="mt-4">{message}</p>}
        </form>
    );
}