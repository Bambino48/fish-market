import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/getCurrentUser";
import OrderForm from "../../components/orders/OrderForm";
import Image from "next/image";

type FishDetailPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function FishDetailPage({ params }: FishDetailPageProps) {
    const { id } = await params;

    const fishId = Number(id);

    if (isNaN(fishId)) {
        notFound();
    }

    const fish = await prisma.fish.findUnique({
        where: {
            id: fishId,
        },
        include: {
            seller: true,
        },
    });

    if (!fish || !fish.available) {
        notFound();
    }

    const user = await getCurrentUser();

    return (
        <main className="max-w-3xl mx-auto p-8">
            <Link
                href="/fishes"
                className="inline-block mb-6 px-4 py-2 bg-gray-200 rounded-lg"
            >
                ← Retour au catalogue
            </Link>

            <div className="border rounded-2xl p-6 shadow-sm">
                <h1 className="text-3xl font-bold">{fish.title}</h1>
                {fish.imageUrl && (
                    <div className="mt-6 overflow-hidden rounded-2xl">
                        <Image
                            src={fish.imageUrl}
                            alt={fish.title}
                            width={800}
                            height={500}
                            className="w-full h-80 object-cover"
                        />
                    </div>
                )}

                <div className="mt-6 space-y-3">
                    <p>
                        <strong>Espèce :</strong> {fish.species}
                    </p>
                    <p>
                        <strong>Description :</strong>{" "}
                        {fish.description || "Aucune description"}
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
                    <p>
                        <strong>Téléphone vendeur :</strong> {fish.seller.phone}
                    </p>
                    <p>
                        <strong>Ville :</strong> {fish.seller.city || "Non renseignée"}
                    </p>
                </div>

                {!user && (
                    <div className="mt-8">
                        <p className="mb-3">Connectez-vous comme acheteur pour commander.</p>
                        <Link
                            href="/login"
                            className="px-5 py-3 bg-black text-white rounded-lg"
                        >
                            Se connecter
                        </Link>
                    </div>
                )}

                {user?.role === "BUYER" && <OrderForm fishId={fish.id} fishTitle={fish.title} />}

                {user?.role === "SELLER" && (
                    <div className="mt-8">
                        <p className="text-gray-700">
                            Les vendeurs ne peuvent pas commander depuis cette page.
                        </p>
                    </div>
                )}

                {user?.role === "ADMIN" && (
                    <div className="mt-8">
                        <p className="text-gray-700">
                            Compte administrateur connecté.
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}