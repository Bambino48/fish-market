import { prisma } from "@/lib/prisma";
import Link from "next/link";
import FishFilters from "../components/fishes/FishFilters";
import Image from "next/image";

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
        <main className="p-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Poissons disponibles</h1>
                    <p className="mt-2 text-gray-600">
                        Découvrez les annonces publiées par les vendeurs.
                    </p>
                </div>

                <Link
                    href="/"
                    className="px-4 py-2 bg-black text-white rounded-lg"
                >
                    Accueil
                </Link>
            </div>

            <FishFilters />

            {(search || species || location) && (
                <div className="mt-4 flex gap-3 flex-wrap">
                    {search && (
                        <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                            Recherche : {search}
                        </span>
                    )}
                    {species && (
                        <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                            Espèce : {species}
                        </span>
                    )}
                    {location && (
                        <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                            Lieu : {location}
                        </span>
                    )}
                </div>
            )}

            <div className="mt-8">
                {fishes.length === 0 ? (
                    <div className="rounded-xl border p-6">
                        <p>Aucun poisson ne correspond à votre recherche.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {fishes.map((fish) => (
                            <div key={fish.id} className="border rounded-xl p-5 shadow-sm">
                                {fish.imageUrl && (
                                    <div className="mb-4 overflow-hidden rounded-xl">
                                        <Image
                                            src={fish.imageUrl}
                                            alt={fish.title}
                                            width={500}
                                            height={300}
                                            className="h-48 w-full object-cover"
                                        />
                                    </div>
                                )}
                                <h2 className="text-xl font-semibold">{fish.title}</h2>

                                <div className="mt-3 space-y-1">
                                    <p>
                                        <strong>Espèce :</strong> {fish.species}
                                    </p>
                                    <p>
                                        <strong>Prix :</strong> {fish.price} FCFA
                                    </p>
                                    <p>
                                        <strong>Quantité :</strong> {fish.quantity} {fish.unit}
                                    </p>
                                    <p>
                                        <strong>Lieu :</strong> {fish.location || "Non renseigné"}
                                    </p>
                                    <p>
                                        <strong>Vendeur :</strong> {fish.seller.name}
                                    </p>
                                </div>

                                <div className="mt-5">
                                    <Link
                                        href={`/fishes/${fish.id}`}
                                        className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg"
                                    >
                                        Voir détail
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}