import { getCurrentUser } from "@/lib/getCurrentUser";
import { redirect } from "next/navigation";
import NewFishForm from "../../../components/fishes/NewFishForm";
import Link from "next/link";
import {
    ArrowLeft,
    FishSymbol,
    Plus,
    ShieldCheck,
    Store,
} from "lucide-react";

export default async function NewFishPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    if (user.role !== "SELLER") {
        redirect("/dashboard");
    }

    return (
        <main className="bg-slate-50">
            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                <div className="overflow-hidden rounded-4xl border border-slate-200 bg-linear-to-r from-slate-900 via-slate-800 to-sky-900 text-white shadow-lg">
                    <div className="flex flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-8 md:py-10">
                        <div className="max-w-3xl">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur">
                                <Plus className="h-4 w-4" />
                                Espace vendeur
                            </div>

                            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                                Ajouter un poisson
                            </h1>

                            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                                Publiez une nouvelle annonce pour rendre votre poisson visible
                                dans le catalogue Fish Market et permettre aux acheteurs de le
                                consulter rapidement.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="/dashboard/fishes"
                                className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Mes poissons
                            </Link>

                            <Link
                                href="/dashboard"
                                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                            >
                                <Store className="h-4 w-4" />
                                Dashboard
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                    <div className="space-y-6">
                        <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                                    <FishSymbol className="h-5 w-5" />
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold tracking-tight text-slate-900">
                                        Nouvelle annonce
                                    </h2>
                                    <p className="mt-1 text-sm leading-6 text-slate-600">
                                        Remplissez soigneusement les informations pour mettre votre
                                        produit en valeur dans le catalogue.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 space-y-3">
                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <h3 className="text-sm font-semibold text-slate-900">
                                        Titre clair
                                    </h3>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">
                                        Utilisez un titre simple et précis pour aider l’acheteur à
                                        identifier rapidement votre produit.
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <h3 className="text-sm font-semibold text-slate-900">
                                        Description utile
                                    </h3>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">
                                        Décrivez l’état, la qualité, la préparation ou les détails
                                        utiles concernant le poisson proposé.
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <h3 className="text-sm font-semibold text-slate-900">
                                        Informations complètes
                                    </h3>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">
                                        Indiquez le bon prix, la bonne quantité, l’unité correcte et
                                        ajoutez une image si possible.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold tracking-tight text-slate-900">
                                        Bonnes pratiques
                                    </h2>
                                    <p className="mt-1 text-sm leading-6 text-slate-600">
                                        Une annonce bien renseignée améliore la confiance et facilite
                                        les commandes.
                                    </p>
                                </div>
                            </div>

                            <ul className="mt-6 space-y-3 text-sm leading-6 text-slate-600">
                                <li>• Choisissez un nom de produit compréhensible.</li>
                                <li>• Vérifiez que le prix saisi est correct.</li>
                                <li>• Précisez une quantité réaliste et disponible.</li>
                                <li>• Ajoutez une image nette lorsque c’est possible.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                                Formulaire d’annonce
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                Renseignez les informations de votre poisson pour publier une
                                nouvelle annonce sur la plateforme.
                            </p>
                        </div>

                        <NewFishForm />
                    </div>
                </div>
            </section>
        </main>
    );
}