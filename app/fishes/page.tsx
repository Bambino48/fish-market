import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function FishesPage() {
    const fishes = await prisma.fish.findMany({
        where: {
            available: true,
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
            <div className="flex items-center justify-between">
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

            <div className="mt-8">
                {fishes.length === 0 ? (
                    <p>Aucun poisson disponible pour le moment.</p>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {fishes.map((fish) => (
                            <div key={fish.id} className="border rounded-xl p-5 shadow-sm">
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