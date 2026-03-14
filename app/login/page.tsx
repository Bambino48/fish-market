"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowRight,
    Loader2,
    LockKeyhole,
    LogIn,
    Phone,
    ShoppingBasket,
    Store,
    UserPlus,
} from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
    const router = useRouter();

    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

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
                toast.error(data.error || "Erreur de connexion.");
                setLoading(false);
                return;
            }

            toast.success("Connexion réussie.");

            router.push("/dashboard");
            router.refresh();
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
                            <LogIn className="h-4 w-4" />
                            Accéder à Fish Market
                        </div>

                        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
                            Connexion
                        </h1>

                        <p className="mt-4 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
                            Connectez-vous pour accéder à votre espace personnel et utiliser
                            les fonctionnalités de Fish Market selon votre rôle.
                        </p>

                        <div className="mt-8 space-y-4">
                            <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                                        <ShoppingBasket className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-semibold">Acheteur</h2>
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
                                        <h2 className="text-base font-semibold">Vendeur</h2>
                                        <p className="mt-1 text-sm leading-6 text-white/75">
                                            Publiez vos annonces, gérez vos poissons et suivez les
                                            commandes reçues.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-3xl border border-white/15 bg-white/5 p-5">
                                <p className="text-sm font-semibold text-white">
                                    Pas encore de compte ?
                                </p>
                                <p className="mt-2 text-sm leading-6 text-white/75">
                                    Créez votre compte pour rejoindre la plateforme et accéder à
                                    votre espace utilisateur.
                                </p>

                                <div className="mt-4">
                                    <Link
                                        href="/register"
                                        className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                                    >
                                        <UserPlus className="h-4 w-4" />
                                        Créer un compte
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                                Se connecter
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                Entrez vos identifiants pour accéder à votre compte Fish Market.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
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
                                        placeholder="Entrez votre numéro"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                                        required
                                    />
                                </div>
                            </div>

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
                                        placeholder="Entrez votre mot de passe"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="rounded-3xl bg-slate-50 p-4">
                                <p className="text-sm leading-6 text-slate-600">
                                    Après connexion, vous serez redirigé vers votre dashboard pour
                                    accéder rapidement à vos fonctionnalités principales.
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
                                        Connexion...
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="h-4 w-4" />
                                        Se connecter
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                            <div>
                                <p className="text-sm font-semibold text-slate-900">
                                    Nouveau sur Fish Market ?
                                </p>
                                <p className="mt-1 text-sm text-slate-600">
                                    Créez un compte en quelques instants.
                                </p>
                            </div>

                            <Link
                                href="/register"
                                className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
                            >
                                <ArrowRight className="h-4 w-4" />
                                Inscription
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}