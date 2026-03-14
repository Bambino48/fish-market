import { getCurrentUser } from "@/lib/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import OrderStatusBadge from "../../components/orders/OrderStatusBadge";
import {
    ArrowLeft,
    ClipboardList,
    Package,
    ShoppingBasket,
    Store,
    Wallet,
    Phone,
    FishSymbol,
} from "lucide-react";

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
        <main className="bg-slate-50">
            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                <div className="overflow-hidden rounded-4xl border border-slate-200 bg-linear-to-r from-slate-900 via-slate-800 to-sky-900 text-white shadow-lg">
                    <div className="flex flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-8 md:py-10">
                        <div className="max-w-3xl">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur">
                                <ClipboardList className="h-4 w-4" />
                                Espace acheteur
                            </div>

                            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                                Mes commandes
                            </h1>

                            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                                Consultez toutes vos commandes, vérifiez leur statut et retrouvez
                                rapidement les informations liées aux vendeurs et aux montants.
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
                                href="/fishes"
                                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                            >
                                <ShoppingBasket className="h-4 w-4" />
                                Voir le catalogue
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                                <ClipboardList className="h-5 w-5" />
                            </div>

                            <div>
                                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                                    Suivi des commandes
                                </h2>
                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                    Retrouvez ici toutes les commandes passées depuis votre compte
                                    acheteur avec leur état actuel.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-3">
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Total
                                </p>
                                <p className="mt-2 text-2xl font-bold text-slate-900">
                                    {orders.length}
                                </p>
                                <p className="mt-1 text-sm text-slate-600">
                                    commande{orders.length > 1 ? "s" : ""}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    En attente
                                </p>
                                <p className="mt-2 text-2xl font-bold text-slate-900">
                                    {orders.filter((order) => order.status === "PENDING").length}
                                </p>
                                <p className="mt-1 text-sm text-slate-600">
                                    à confirmer
                                </p>
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Confirmées
                                </p>
                                <p className="mt-2 text-2xl font-bold text-slate-900">
                                    {orders.filter((order) => order.status === "CONFIRMED").length}
                                </p>
                                <p className="mt-1 text-sm text-slate-600">
                                    validées
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                                <Package className="h-5 w-5" />
                            </div>

                            <div>
                                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                                    Bon à savoir
                                </h2>
                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                    Utilisez cette page pour suivre vos achats et vérifier les
                                    informations importantes avant toute suite d’échange.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <h3 className="text-sm font-semibold text-slate-900">
                                    Vérifiez le statut
                                </h3>
                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    Chaque commande affiche son état actuel : en attente, confirmée
                                    ou annulée.
                                </p>
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-4">
                                <h3 className="text-sm font-semibold text-slate-900">
                                    Consultez le vendeur
                                </h3>
                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    Vous retrouvez le nom du vendeur et son téléphone directement
                                    sur chaque commande.
                                </p>
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-4">
                                <h3 className="text-sm font-semibold text-slate-900">
                                    Continuez vos achats
                                </h3>
                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    Retournez au catalogue pour explorer d’autres offres
                                    disponibles.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                            Historique des commandes
                        </h2>
                        <p className="mt-1 text-sm text-slate-600">
                            {orders.length === 0
                                ? "Aucune commande enregistrée pour le moment."
                                : `${orders.length} commande${orders.length > 1 ? "s" : ""} trouvée${orders.length > 1 ? "s" : ""}.`}
                        </p>
                    </div>
                </div>

                <div className="mt-6">
                    {orders.length === 0 ? (
                        <div className="rounded-4xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                                <ClipboardList className="h-7 w-7" />
                            </div>

                            <h3 className="mt-5 text-xl font-semibold text-slate-900">
                                Aucune commande pour le moment
                            </h3>

                            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">
                                Vous n’avez encore passé aucune commande. Explorez le catalogue
                                pour découvrir les poissons disponibles et effectuer votre premier
                                achat.
                            </p>

                            <div className="mt-6 flex justify-center">
                                <Link
                                    href="/fishes"
                                    className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
                                >
                                    <FishSymbol className="h-4 w-4" />
                                    Voir le catalogue
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2">
                            {orders.map((order) => (
                                <article
                                    key={order.id}
                                    className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <h3 className="text-2xl font-semibold tracking-tight text-slate-900">
                                            {order.fish.title}
                                        </h3>
                                        <OrderStatusBadge status={order.status} />
                                    </div>

                                    <div className="mt-5 grid gap-3 rounded-3xl bg-slate-50 p-5 text-sm text-slate-700">
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="inline-flex items-center gap-2 text-slate-500">
                                                <Store className="h-4 w-4" />
                                                Vendeur
                                            </span>
                                            <span className="font-medium text-slate-900">
                                                {order.seller.name}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between gap-3">
                                            <span className="inline-flex items-center gap-2 text-slate-500">
                                                <Phone className="h-4 w-4" />
                                                Téléphone vendeur
                                            </span>
                                            <span className="font-medium text-slate-900">
                                                {order.seller.phone}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between gap-3">
                                            <span className="inline-flex items-center gap-2 text-slate-500">
                                                <Package className="h-4 w-4" />
                                                Quantité commandée
                                            </span>
                                            <span className="font-medium text-slate-900">
                                                {order.quantity}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between gap-3">
                                            <span className="inline-flex items-center gap-2 text-slate-500">
                                                <Wallet className="h-4 w-4" />
                                                Montant total
                                            </span>
                                            <span className="font-semibold text-slate-900">
                                                {order.totalPrice} FCFA
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-5 flex items-center justify-between gap-3">
                                        <span className="text-xs font-medium text-slate-400">
                                            Commande #{order.id}
                                        </span>

                                        <Link
                                            href={`/fishes/${order.fish.id}`}
                                            className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
                                        >
                                            Voir le poisson
                                        </Link>
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