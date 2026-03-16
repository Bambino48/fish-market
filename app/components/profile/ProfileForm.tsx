"use client";

import { useState } from "react";
import Image from "next/image";
import {
    Camera,
    Mail,
    MapPin,
    Phone,
    ShieldCheck,
    UserRound,
} from "lucide-react";
import { toast } from "sonner";

type Props = {
    currentName: string;
    currentCity: string;
    currentProfileImageUrl: string;
    currentPhone?: string;
    currentEmail?: string | null;
    currentRole?: string;
};

function getRoleLabel(role?: string) {
    switch (role) {
        case "SELLER":
            return "Vendeur";
        case "BUYER":
            return "Acheteur";
        case "ADMIN":
            return "Administrateur";
        default:
            return role || "Non renseigné";
    }
}

export default function ProfileForm({
    currentName,
    currentCity,
    currentProfileImageUrl,
    currentPhone,
    currentEmail,
    currentRole,
}: Props) {
    const [name, setName] = useState(currentName);
    const [city, setCity] = useState(currentCity);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [profileImageUrl, setProfileImageUrl] = useState(currentProfileImageUrl);
    const [loading, setLoading] = useState(false);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        setImageFile(e.target.files?.[0] || null);
    }

    async function uploadImage() {
        if (!imageFile) return profileImageUrl;

        const formData = new FormData();
        formData.append("file", imageFile);

        const res = await fetch("/api/profile/upload", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || "Erreur lors de l’upload de l’image.");
        }

        return data.imageUrl as string;
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("Le nom est obligatoire.");
            return;
        }

        setLoading(true);

        try {
            const imageUrl = await uploadImage();

            const res = await fetch("/api/profile/update", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name.trim(),
                    city: city.trim(),
                    profileImageUrl: imageUrl,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Erreur lors de la mise à jour du profil.");
                return;
            }

            if (imageUrl !== profileImageUrl) {
                setProfileImageUrl(imageUrl);
            }

            setImageFile(null);
            toast.success("Profil mis à jour avec succès.");
            window.location.reload();
        } catch (error) {
            console.error(error);

            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erreur lors de la mise à jour.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <form id="profile-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-6 md:flex-row md:items-start">
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative h-28 w-28 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm">
                            {profileImageUrl ? (
                                <Image
                                    src={profileImageUrl}
                                    alt="Photo de profil"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-slate-400">
                                    <UserRound className="h-10 w-10" />
                                </div>
                            )}
                        </div>

                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                            <Camera className="h-4 w-4" />
                            Changer la photo
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>

                        {imageFile && (
                            <p className="max-w-45 text-center text-xs text-slate-500">
                                {imageFile.name}
                            </p>
                        )}
                    </div>

                    <div className="grid flex-1 gap-4 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-semibold text-slate-800">
                                Nom complet
                            </label>
                            <div className="relative">
                                <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                                    placeholder="Nom"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-800">
                                Ville
                            </label>
                            <div className="relative">
                                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                                    placeholder="Ville"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-800">
                                Téléphone
                            </label>
                            <div className="relative">
                                <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={currentPhone || ""}
                                    readOnly
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-600 outline-none"
                                    placeholder="Téléphone"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-800">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={currentEmail || ""}
                                    readOnly
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-600 outline-none"
                                    placeholder="Email non renseigné"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-800">
                                Rôle
                            </label>
                            <div className="relative">
                                <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={getRoleLabel(currentRole)}
                                    readOnly
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-600 outline-none"
                                    placeholder="Rôle"
                                />
                            </div>
                        </div>

                        {loading && (
                            <div className="md:col-span-2">
                                <p className="text-sm text-slate-500">Mise à jour en cours...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </form>
    );
}