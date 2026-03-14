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
        location: "San Pedro",
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] || null;
        setImageFile(file);
    }

    async function uploadImage() {
        if (!imageFile) return null;

        const uploadData = new FormData();
        uploadData.append("file", imageFile);

        const uploadRes = await fetch("/api/upload", {
            method: "POST",
            body: uploadData,
        });

        const uploadResult = await uploadRes.json();

        if (!uploadRes.ok) {
            throw new Error(uploadResult.error || "Erreur lors de l'upload image.");
        }

        return uploadResult.imageUrl as string;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const imageUrl = await uploadImage();

            const res = await fetch("/api/fishes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    imageUrl,
                }),
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

            if (error instanceof Error) {
                setMessage(error.message);
            } else {
                setMessage("Erreur réseau.");
            }
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
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFileChange}
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