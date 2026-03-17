import { getCurrentUser } from "@/lib/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import FishActions from "../../components/fishes/FishActions";
import {
    ArrowLeft,
    BadgeCheck,
    Eye,
    FishSymbol,
    MapPin,
    Package,
    Plus,
    Store,
    Tag,
} from "lucide-react";

export default async function SellerFishesPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    if (user.role !== "SELLER") {
        redirect("/dashboard");
    }

    const fishes = await prisma.fish.findMany({
        where: {
            sellerId: user.id,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    const availableCount = fishes.filter((fish) => fish.available).length;
    const unavailableCount = fishes.filter((fish) => !fish.available).length;

    return (
        <main className="bg-slate-50">
            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                <div className="overflow-hidden rounded-4xl border border-slate-200 bg-linear-to-r from-slate-900 via-slate-800 to-sky-900 text-white shadow-lg">
                    <div className="flex flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-8 md:py-10">
                        <div className="max-w-3xl">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur">
                                <Store className="h-4 w-4" />
                                Espace vendeur
                            </div>

                            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                                Mes poissons
                            </h1>

                            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                                Retrouvez toutes vos annonces publiées, vérifiez leur
                                disponibilité et accédez rapidement à la création d’une nouvelle
                                annonce.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Retour dashboard
                            </Link>

                            <Link
                                href="/dashboard/fishes/new"
                                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                            >
                                <Plus className="h-4 w-4" />
                                Ajouter un poisson
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                                <FishSymbol className="h-5 w-5" />
                            </div>

                            <div>
                                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                                    Vue d’ensemble des annonces
                                </h2>
                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                    Suivez rapidement le nombre d’annonces publiées et leur état
                                    de disponibilité.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-3">
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Total
                                </p>
                                <p className="mt-2 text-2xl font-bold text-slate-900">
                                    {fishes.length}
                                </p>
                                <p className="mt-1 text-sm text-slate-600">
                                    annonce{fishes.length > 1 ? "s" : ""}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Disponibles
                                </p>
                                <p className="mt-2 text-2xl font-bold text-slate-900">
                                    {availableCount}
                                </p>
                                <p className="mt-1 text-sm text-slate-600">
                                    actives
                                </p>
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Indisponibles
                                </p>
                                <p className="mt-2 text-2xl font-bold text-slate-900">
                                    {unavailableCount}
                                </p>
                                <p className="mt-1 text-sm text-slate-600">
                                    non actives
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                                <BadgeCheck className="h-5 w-5" />
                            </div>

                            <div>
                                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                                    Conseils vendeur
                                </h2>
                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                    Une annonce bien présentée améliore la visibilité et facilite
                                    les commandes.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <h3 className="text-sm font-semibold text-slate-900">
                                    Titre précis
                                </h3>
                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    Utilisez un titre clair pour aider l’acheteur à identifier
                                    rapidement le produit.
                                </p>
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-4">
                                <h3 className="text-sm font-semibold text-slate-900">
                                    Image de qualité
                                </h3>
                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    Une bonne photo améliore fortement l’attractivité de votre
                                    annonce.
                                </p>
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-4">
                                <h3 className="text-sm font-semibold text-slate-900">
                                    Disponibilité à jour
                                </h3>
                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    Gardez vos annonces à jour pour éviter toute confusion avec
                                    les acheteurs.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                            Liste de mes annonces
                        </h2>
                        <p className="mt-1 text-sm text-slate-600">
                            {fishes.length === 0
                                ? "Aucune annonce publiée pour le moment."
                                : `${fishes.length} annonce${fishes.length > 1 ? "s" : ""} enregistrée${fishes.length > 1 ? "s" : ""}.`}
                        </p>
                    </div>
                </div>

                <div className="mt-6">
                    {fishes.length === 0 ? (
                        <div className="rounded-4xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                                <FishSymbol className="h-7 w-7" />
                            </div>

                            <h3 className="mt-5 text-xl font-semibold text-slate-900">
                                Aucune annonce publiée
                            </h3>

                            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">
                                Vous n’avez encore publié aucun poisson. Ajoutez votre première
                                annonce pour commencer à apparaître dans le catalogue.
                            </p>

                            <div className="mt-6 flex justify-center">
                                <Link
                                    href="/dashboard/fishes/new"
                                    className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
                                >
                                    <Plus className="h-4 w-4" />
                                    Ajouter un poisson
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {fishes.map((fish) => (
                                <article
                                    key={fish.id}
                                    className="group overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                                >
                                    {fish.imageUrl ? (
                                        <div className="relative h-60 w-full overflow-hidden">
                                            <Image
                                                src={fish.imageUrl}
                                                alt={fish.title}
                                                width={500}
                                                height={300}
                                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                            />

                                            <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800 shadow-sm backdrop-blur">
                                                <FishSymbol className="h-3.5 w-3.5" />
                                                {fish.species}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex h-60 w-full items-center justify-center bg-slate-100 text-slate-400">
                                            <FishSymbol className="h-10 w-10" />
                                        </div>
                                    )}

                                    <div className="p-5">
                                        <div className="flex items-start justify-between gap-3">
                                            <h3 className="text-2xl font-semibold tracking-tight text-slate-900">
                                                {fish.title}
                                            </h3>

                                            <span
                                                className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-semibold ${fish.available
                                                    ? "bg-emerald-50 text-emerald-700"
                                                    : "bg-slate-100 text-slate-600"
                                                    }`}
                                            >
                                                {fish.available ? "Disponible" : "Indisponible"}
                                            </span>
                                        </div>

                                        <div className="mt-5 grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                                            <div className="flex items-center justify-between gap-3">
                                                <span className="inline-flex items-center gap-2 text-slate-500">
                                                    <Tag className="h-4 w-4" />
                                                    Prix
                                                </span>
                                                <span className="font-semibold text-slate-900">
                                                    {fish.price} FCFA
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between gap-3">
                                                <span className="inline-flex items-center gap-2 text-slate-500">
                                                    <Package className="h-4 w-4" />
                                                    Quantité
                                                </span>
                                                <span className="font-medium text-slate-900">
                                                    {fish.quantity} {fish.unit}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between gap-3">
                                                <span className="inline-flex items-center gap-2 text-slate-500">
                                                    <MapPin className="h-4 w-4" />
                                                    Lieu
                                                </span>
                                                <span className="font-medium text-slate-900">
                                                    {fish.location || "Non renseigné"}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-5 flex items-center justify-between gap-3">
                                            <span className="text-xs font-medium text-slate-400">
                                                Annonce #{fish.id}
                                            </span>

                                            <Link
                                                href={`/fishes/${fish.id}`}
                                                className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
                                            >
                                                <Eye className="h-4 w-4" />
                                                Voir détail
                                            </Link>
                                        </div>

                                        <FishActions
                                            fishId={fish.id}
                                            currentAvailable={fish.available}
                                            title={fish.title}
                                            species={fish.species}
                                            description={fish.description}
                                            price={fish.price}
                                            quantity={fish.quantity}
                                            unit={fish.unit}
                                            imageUrl={fish.imageUrl}
                                            location={fish.location}
                                        />
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}