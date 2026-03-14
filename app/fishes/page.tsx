import { prisma } from "@/lib/prisma";
import Link from "next/link";
import FishFilters from "../components/fishes/FishFilters";
import Image from "next/image";
import {
    ArrowLeft,
    FishSymbol,
    MapPin,
    Search,
    ShoppingBasket,
    Tag,
    UserRound,
    Package,
    Info,
} from "lucide-react";

type FishesPageProps = {
    searchParams: Promise<{
        search?: string;
        species?: string;
        location?: string;
    }>;
};

export default async function FishesPage({ searchParams }: FishesPageProps) {
    const params = await searchParams;

    const search = params.search || "";
    const species = params.species || "";
    const location = params.location || "";

    const fishes = await prisma.fish.findMany({
        where: {
            available: true,
            AND: [
                search
                    ? {
                        OR: [
                            {
                                title: {
                                    contains: search,
                                    mode: "insensitive",
                                },
                            },
                            {
                                description: {
                                    contains: search,
                                    mode: "insensitive",
                                },
                            },
                        ],
                    }
                    : {},
                species
                    ? {
                        species: {
                            contains: species,
                            mode: "insensitive",
                        },
                    }
                    : {},
                location
                    ? {
                        location: {
                            contains: location,
                            mode: "insensitive",
                        },
                    }
                    : {},
            ],
        },
        include: {
            seller: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <main className="bg-slate-50">
            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                <div className="overflow-hidden rounded-4xl border border-slate-200 bg-linear-to-r from-slate-900 via-slate-800 to-sky-900 text-white shadow-lg">
                    <div className="flex flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-8 md:py-10">
                        <div className="max-w-3xl">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur">
                                <FishSymbol className="h-4 w-4" />
                                Catalogue Fish Market
                            </div>

                            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                                Poissons disponibles
                            </h1>

                            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                                Découvrez les annonces publiées par les vendeurs, filtrez selon
                                vos besoins et accédez rapidement aux détails de chaque offre.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Accueil
                            </Link>

                            <div className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white">
                                <ShoppingBasket className="h-4 w-4" />
                                {fishes.length} annonce{fishes.length > 1 ? "s" : ""}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                                <Search className="h-5 w-5" />
                            </div>

                            <div>
                                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                                    Recherche et filtres
                                </h2>
                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                    Recherchez par titre, espèce ou lieu pour trouver rapidement
                                    les poissons qui correspondent à votre besoin.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <FishFilters />
                        </div>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                                <Info className="h-5 w-5" />
                            </div>

                            <div>
                                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                                    Conseils de recherche
                                </h2>
                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                    Utilisez les filtres pour affiner votre recherche et retrouver
                                    plus vite les bonnes annonces.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <h3 className="text-sm font-semibold text-slate-900">
                                    Par espèce
                                </h3>
                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    Exemple : Thon, Capitaine, Crevette.
                                </p>
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-4">
                                <h3 className="text-sm font-semibold text-slate-900">
                                    Par lieu
                                </h3>
                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    Exemple : San Pedro, Grand-Béréby, Sassandra.
                                </p>
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-4 sm:col-span-2">
                                <h3 className="text-sm font-semibold text-slate-900">
                                    Recherche textuelle
                                </h3>
                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    Vous pouvez aussi rechercher à partir du titre ou de la
                                    description de l’annonce.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {(search || species || location) && (
                    <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Filtres actifs
                                </h2>
                                <p className="mt-1 text-sm text-slate-600">
                                    Voici les critères actuellement appliqués au catalogue.
                                </p>
                            </div>

                            <Link
                                href="/fishes"
                                className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
                            >
                                Réinitialiser les filtres
                            </Link>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-3">
                            {search && (
                                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-700">
                                    <Search className="h-4 w-4" />
                                    Recherche : {search}
                                </span>
                            )}

                            {species && (
                                <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5 text-sm font-medium text-orange-700">
                                    <FishSymbol className="h-4 w-4" />
                                    Espèce : {species}
                                </span>
                            )}

                            {location && (
                                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
                                    <MapPin className="h-4 w-4" />
                                    Lieu : {location}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                <div className="mt-8 flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                            Résultats du catalogue
                        </h2>
                        <p className="mt-1 text-sm text-slate-600">
                            {fishes.length === 0
                                ? "Aucune annonce trouvée pour les critères sélectionnés."
                                : `${fishes.length} annonce${fishes.length > 1 ? "s" : ""} disponible${fishes.length > 1 ? "s" : ""}.`}
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
                                Aucun poisson trouvé
                            </h3>

                            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">
                                Aucun poisson ne correspond à votre recherche actuelle. Essayez
                                de modifier ou de réinitialiser vos filtres pour voir d’autres
                                annonces.
                            </p>

                            <div className="mt-6 flex justify-center">
                                <Link
                                    href="/fishes"
                                    className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
                                >
                                    <Search className="h-4 w-4" />
                                    Voir toutes les annonces
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
                                                fill
                                                className="object-cover transition duration-500 group-hover:scale-105"
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

                                            <span className="inline-flex shrink-0 items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                                Disponible
                                            </span>
                                        </div>

                                        {fish.description && (
                                            <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">
                                                {fish.description}
                                            </p>
                                        )}

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

                                            <div className="flex items-center justify-between gap-3">
                                                <span className="inline-flex items-center gap-2 text-slate-500">
                                                    <UserRound className="h-4 w-4" />
                                                    Vendeur
                                                </span>
                                                <span className="font-medium text-slate-900">
                                                    {fish.seller.name}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-5 flex items-center justify-between gap-3">
                                            <Link
                                                href={`/fishes/${fish.id}`}
                                                className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700"
                                            >
                                                Voir détail
                                            </Link>

                                            <span className="text-xs font-medium text-slate-400">
                                                ID #{fish.id}
                                            </span>
                                        </div>
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