import { getCurrentUser } from "@/lib/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function BuyerOrdersPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    if (user.role !== "BUYER") {
        redirect("/dashboard");
    }

    const orders = await prisma.order.findMany({
        where: {
            buyerId: user.id,
        },
        include: {
            fish: true,
            seller: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <main className="p-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Mes commandes</h1>

                <div className="flex gap-3">
                    <Link
                        href="/dashboard"
                        className="px-4 py-2 bg-gray-200 rounded-lg"
                    >
                        Retour dashboard
                    </Link>

                    <Link
                        href="/fishes"
                        className="px-4 py-2 bg-black text-white rounded-lg"
                    >
                        Voir le catalogue
                    </Link>
                </div>
            </div>

            <div className="mt-8">
                {orders.length === 0 ? (
                    <p>Vous n&apos;avez encore passé aucune commande.</p>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {orders.map((order) => (
                            <div key={order.id} className="border rounded-xl p-4">
                                <h2 className="text-xl font-semibold">{order.fish.title}</h2>
                                <p className="mt-2">
                                    <strong>Vendeur :</strong> {order.seller.name}
                                </p>
                                <p>
                                    <strong>Téléphone vendeur :</strong> {order.seller.phone}
                                </p>
                                <p>
                                    <strong>Quantité commandée :</strong> {order.quantity}
                                </p>
                                <p>
                                    <strong>Montant total :</strong> {order.totalPrice} FCFA
                                </p>
                                <p>
                                    <strong>Statut :</strong>{" "}
                                    {order.status === "PENDING" && "En attente"}
                                    {order.status === "CONFIRMED" && "Confirmée"}
                                    {order.status === "CANCELLED" && "Annulée"}
                                    {order.status === "COMPLETED" && "Terminée"}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}