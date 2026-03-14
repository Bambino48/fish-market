"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    FileImage,
    FishSymbol,
    Loader2,
    MapPin,
    Package,
    PencilLine,
    Tag,
    Type,
    Upload,
} from "lucide-react";
import { toast } from "sonner";

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
                toast.error(data.error || "Erreur lors de l'ajout.");
                setLoading(false);
                return;
            }

            toast.success("Poisson ajouté avec succès.");

            setTimeout(() => {
                router.push("/dashboard/fishes");
                router.refresh();
            }, 1000);
        } catch (error) {
            console.error(error);

            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erreur réseau.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-5">
                <div className="space-y-2">
                    <label
                        htmlFor="title"
                        className="text-sm font-medium text-slate-700"
                    >
                        Titre de l’annonce
                    </label>
                    <div className="relative">
                        <Type className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            id="title"
                            type="text"
                            name="title"
                            placeholder="Ex : Thon frais de San Pedro"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="species"
                        className="text-sm font-medium text-slate-700"
                    >
                        Espèce
                    </label>
                    <div className="relative">
                        <FishSymbol className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            id="species"
                            type="text"
                            name="species"
                            placeholder="Ex : Thon, Capitaine, Crevette"
                            value={formData.species}
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="description"
                        className="text-sm font-medium text-slate-700"
                    >
                        Description
                    </label>
                    <div className="relative">
                        <PencilLine className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-slate-400" />
                        <textarea
                            id="description"
                            name="description"
                            placeholder="Décrivez la qualité, la préparation, l’origine ou tout autre détail utile..."
                            value={formData.description}
                            onChange={handleChange}
                            rows={5}
                            className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                        />
                    </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                        <label
                            htmlFor="price"
                            className="text-sm font-medium text-slate-700"
                        >
                            Prix
                        </label>
                        <div className="relative">
                            <Tag className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                id="price"
                                type="number"
                                name="price"
                                placeholder="Ex : 5000"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                                required
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="quantity"
                            className="text-sm font-medium text-slate-700"
                        >
                            Quantité
                        </label>
                        <div className="relative">
                            <Package className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                id="quantity"
                                type="number"
                                name="quantity"
                                placeholder="Ex : 10"
                                value={formData.quantity}
                                onChange={handleChange}
                                className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                                required
                                min="0"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                        <label
                            htmlFor="unit"
                            className="text-sm font-medium text-slate-700"
                        >
                            Unité
                        </label>
                        <select
                            id="unit"
                            name="unit"
                            value={formData.unit}
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                        >
                            <option value="KG">Kilogramme (KG)</option>
                            <option value="CARTON">Carton</option>
                            <option value="PIECE">Pièce</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="location"
                            className="text-sm font-medium text-slate-700"
                        >
                            Lieu
                        </label>
                        <div className="relative">
                            <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                id="location"
                                type="text"
                                name="location"
                                placeholder="Ex : San Pedro"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                        Image du poisson
                    </label>

                    <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center transition hover:border-sky-400 hover:bg-sky-50">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-sky-700 shadow-sm">
                            {imageFile ? (
                                <FileImage className="h-5 w-5" />
                            ) : (
                                <Upload className="h-5 w-5" />
                            )}
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-slate-900">
                                {imageFile ? imageFile.name : "Choisir une image"}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                                PNG, JPEG ou WEBP
                            </p>
                        </div>

                        <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>
                </div>
            </div>

            <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm leading-6 text-slate-600">
                    Vérifiez bien les informations avant de publier. Une annonce complète
                    et claire améliore sa visibilité dans le catalogue.
                </p>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
                {loading ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Enregistrement...
                    </>
                ) : (
                    <>
                        <Upload className="h-4 w-4" />
                        Publier le poisson
                    </>
                )}
            </button>
        </form>
    );
}