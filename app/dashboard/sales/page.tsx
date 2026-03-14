import { getCurrentUser } from "@/lib/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function SellerSalesPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    if (user.role !== "SELLER") {
        redirect("/dashboard");
    }

    const orders = await prisma.order.findMany({
        where: {
            sellerId: user.id,
        },
        include: {
            fish: true,
            buyer: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <main className="p-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Commandes reçues</h1>

                <div className="flex gap-3">
                    <Link
                        href="/dashboard"
                        className="px-4 py-2 bg-gray-200 rounded-lg"
                    >
                        Retour dashboard
                    </Link>

                    <Link
                        href="/dashboard/fishes"
                        className="px-4 py-2 bg-black text-white rounded-lg"
                    >
                        Mes poissons
                    </Link>
                </div>
            </div>

            <div className="mt-8">
                {orders.length === 0 ? (
                    <p>Aucune commande reçue pour le moment.</p>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {orders.map((order) => (
                            <div key={order.id} className="border rounded-xl p-4">
                                <h2 className="text-xl font-semibold">{order.fish.title}</h2>
                                <p className="mt-2">
                                    <strong>Acheteur :</strong> {order.buyer.name}
                                </p>
                                <p>
                                    <strong>Téléphone acheteur :</strong> {order.buyer.phone}
                                </p>
                                <p>
                                    <strong>Quantité commandée :</strong> {order.quantity}
                                </p>
                                <p>
                                    <strong>Montant total :</strong> {order.totalPrice} FCFA
                                </p>
                                <p>
                                    <strong>Statut :</strong> {order.status}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}