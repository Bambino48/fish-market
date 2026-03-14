"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowRight,
    Loader2,
    LockKeyhole,
    Mail,
    MapPin,
    Phone,
    ShoppingBasket,
    Store,
    UserRound,
    UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

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

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

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
                toast.error(data.error || "Erreur lors de l'inscription.");
                setLoading(false);
                return;
            }

            toast.success("Compte créé avec succès. Redirection vers la connexion...");

            setTimeout(() => {
                router.push("/login");
            }, 1500);
        } catch (error) {
            console.error(error);
            toast.error("Erreur réseau.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="bg-slate-50">
            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                    <div className="overflow-hidden rounded-4xl border border-slate-200 bg-linear-to-br from-slate-900 via-slate-800 to-sky-900 p-8 text-white shadow-lg">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur">
                            <UserPlus className="h-4 w-4" />
                            Rejoindre Fish Market
                        </div>

                        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
                            Créer un compte
                        </h1>

                        <p className="mt-4 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
                            Inscrivez-vous pour accéder à la plateforme Fish Market et profiter
                            d’un espace adapté à votre profil acheteur ou vendeur.
                        </p>

                        <div className="mt-8 space-y-4">
                            <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                                        <ShoppingBasket className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-semibold">Compte acheteur</h2>
                                        <p className="mt-1 text-sm leading-6 text-white/75">
                                            Consultez le catalogue, passez vos commandes et suivez vos
                                            achats depuis votre dashboard.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                                        <Store className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-semibold">Compte vendeur</h2>
                                        <p className="mt-1 text-sm leading-6 text-white/75">
                                            Publiez vos poissons, gérez vos annonces et consultez les
                                            commandes reçues.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-3xl border border-white/15 bg-white/5 p-5">
                                <p className="text-sm font-semibold text-white">
                                    Déjà un compte ?
                                </p>
                                <p className="mt-2 text-sm leading-6 text-white/75">
                                    Connectez-vous pour accéder directement à votre espace.
                                </p>

                                <div className="mt-4">
                                    <Link
                                        href="/login"
                                        className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                                    >
                                        <ArrowRight className="h-4 w-4" />
                                        Aller à la connexion
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                                Informations du compte
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                Remplissez le formulaire ci-dessous pour créer votre compte sur
                                la plateforme.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label
                                    htmlFor="name"
                                    className="text-sm font-medium text-slate-700"
                                >
                                    Nom complet
                                </label>
                                <div className="relative">
                                    <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        placeholder="Entrez votre nom complet"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label
                                        htmlFor="phone"
                                        className="text-sm font-medium text-slate-700"
                                    >
                                        Téléphone
                                    </label>
                                    <div className="relative">
                                        <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <input
                                            id="phone"
                                            type="text"
                                            name="phone"
                                            placeholder="Votre numéro"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label
                                        htmlFor="email"
                                        className="text-sm font-medium text-slate-700"
                                    >
                                        Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            placeholder="Optionnel"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label
                                        htmlFor="password"
                                        className="text-sm font-medium text-slate-700"
                                    >
                                        Mot de passe
                                    </label>
                                    <div className="relative">
                                        <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <input
                                            id="password"
                                            type="password"
                                            name="password"
                                            placeholder="Votre mot de passe"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label
                                        htmlFor="role"
                                        className="text-sm font-medium text-slate-700"
                                    >
                                        Type de compte
                                    </label>
                                    <select
                                        id="role"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                                    >
                                        <option value="BUYER">Acheteur</option>
                                        <option value="SELLER">Vendeur</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="city"
                                    className="text-sm font-medium text-slate-700"
                                >
                                    Ville
                                </label>
                                <div className="relative">
                                    <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <input
                                        id="city"
                                        type="text"
                                        name="city"
                                        placeholder="Votre ville"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                                    />
                                </div>
                            </div>

                            <div className="rounded-3xl bg-slate-50 p-4">
                                <p className="text-sm leading-6 text-slate-600">
                                    En créant un compte, vous pourrez accéder à un espace adapté à
                                    votre rôle et utiliser les fonctionnalités principales de Fish
                                    Market.
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
                                        Création du compte...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="h-4 w-4" />
                                        Créer mon compte
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    );
}