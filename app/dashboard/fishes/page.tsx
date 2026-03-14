import { getCurrentUser } from "@/lib/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

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

    return (
        <main className="p-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Mes poissons</h1>

                <Link
                    href="/dashboard"
                    className="px-4 py-2 bg-gray-200 rounded-lg"
                >
                    Retour dashboard
                </Link>
                <Link
                    href="/dashboard/fishes/new"
                    className="px-4 py-2 bg-black text-white rounded-lg"
                >
                    Ajouter un poisson
                </Link>
            </div>

            <div className="mt-8">
                {fishes.length === 0 ? (
                    <p>Aucun poisson publié pour le moment.</p>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {fishes.map((fish) => (
                            <div key={fish.id} className="border rounded-xl p-4">
                                <h2 className="text-xl font-semibold">{fish.title}</h2>
                                <p className="mt-2">
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
                                    <strong>Disponible :</strong> {fish.available ? "Oui" : "Non"}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}