import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/getCurrentUser";
import OrderForm from "../../components/orders/OrderForm";
import Image from "next/image";
import {
    ArrowLeft,
    BadgeCheck,
    FishSymbol,
    MapPin,
    Package,
    Phone,
    Store,
    Tag,
    UserRound,
    ShieldCheck,
    ShoppingBasket,
    Info,
} from "lucide-react";

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
        <main className="bg-slate-50">
            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                <div className="overflow-hidden rounded-4xl border border-slate-200 bg-linear-to-r from-slate-900 via-slate-800 to-sky-900 text-white shadow-lg">
                    <div className="flex flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-8 md:py-10">
                        <div className="max-w-3xl">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur">
                                <FishSymbol className="h-4 w-4" />
                                Détail d’une annonce
                            </div>

                            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                                {fish.title}
                            </h1>

                            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                                Consultez les informations complètes sur ce poisson, le vendeur,
                                la quantité disponible et les options d’action selon votre rôle.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="/fishes"
                                className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Retour au catalogue
                            </Link>

                            <div className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white">
                                <BadgeCheck className="h-4 w-4" />
                                Annonce disponible
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-sm">
                        <div className="relative min-h-85 bg-slate-100 sm:min-h-105 lg:min-h-140">
                            {fish.imageUrl ? (
                                <>
                                    <Image
                                        src={fish.imageUrl}
                                        alt={fish.title}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm backdrop-blur">
                                        <FishSymbol className="h-3.5 w-3.5" />
                                        {fish.species}
                                    </div>
                                </>
                            ) : (
                                <div className="flex h-full items-center justify-center text-slate-400">
                                    <FishSymbol className="h-10 w-10" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                        {fish.title}
                                    </h2>

                                    {fish.description && (
                                        <p className="mt-4 text-base leading-8 text-slate-600">
                                            {fish.description}
                                        </p>
                                    )}
                                </div>

                                <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                                    Disponible
                                </span>
                            </div>

                            <div className="mt-6 grid gap-3 rounded-3xl bg-slate-50 p-5">
                                <div className="flex items-center justify-between gap-3">
                                    <span className="inline-flex items-center gap-2 text-slate-500">
                                        <FishSymbol className="h-4 w-4" />
                                        Espèce
                                    </span>
                                    <span className="font-semibold text-slate-900">
                                        {fish.species}
                                    </span>
                                </div>

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
                                    <span className="font-semibold text-slate-900">
                                        {fish.quantity} {fish.unit}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between gap-3">
                                    <span className="inline-flex items-center gap-2 text-slate-500">
                                        <MapPin className="h-4 w-4" />
                                        Lieu
                                    </span>
                                    <span className="font-semibold text-slate-900">
                                        {fish.location || "Non renseigné"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                                    <Store className="h-5 w-5" />
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold tracking-tight text-slate-900">
                                        Informations vendeur
                                    </h3>
                                    <p className="mt-1 text-sm leading-6 text-slate-600">
                                        Retrouvez les informations utiles sur le vendeur associé à
                                        cette annonce.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 grid gap-3 rounded-3xl bg-slate-50 p-5">
                                <div className="flex items-center justify-between gap-3">
                                    <span className="inline-flex items-center gap-2 text-slate-500">
                                        <UserRound className="h-4 w-4" />
                                        Vendeur
                                    </span>
                                    <span className="font-semibold text-slate-900">
                                        {fish.seller.name}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between gap-3">
                                    <span className="inline-flex items-center gap-2 text-slate-500">
                                        <Phone className="h-4 w-4" />
                                        Téléphone
                                    </span>
                                    <span className="font-semibold text-slate-900">
                                        {fish.seller.phone}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between gap-3">
                                    <span className="inline-flex items-center gap-2 text-slate-500">
                                        <MapPin className="h-4 w-4" />
                                        Ville
                                    </span>
                                    <span className="font-semibold text-slate-900">
                                        {fish.seller.city || "Non renseignée"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {!user && (
                            <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                                        <ShoppingBasket className="h-5 w-5" />
                                    </div>

                                    <div className="w-full">
                                        <h3 className="text-xl font-bold tracking-tight text-slate-900">
                                            Commander cette annonce
                                        </h3>
                                        <p className="mt-1 text-sm leading-6 text-slate-600">
                                            Connectez-vous avec un compte acheteur pour passer votre
                                            commande.
                                        </p>

                                        <div className="mt-5 rounded-3xl bg-slate-50 p-5">
                                            <p className="text-sm leading-6 text-slate-700">
                                                Vous devez être connecté comme acheteur pour commander ce
                                                poisson depuis la plateforme.
                                            </p>

                                            <div className="mt-4">
                                                <Link
                                                    href="/login"
                                                    className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                                                >
                                                    <UserRound className="h-4 w-4" />
                                                    Se connecter
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {user?.role === "BUYER" && (
                            <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="mb-5 flex items-start gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                                        <ShoppingBasket className="h-5 w-5" />
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold tracking-tight text-slate-900">
                                            Passer une commande
                                        </h3>
                                        <p className="mt-1 text-sm leading-6 text-slate-600">
                                            Complétez le formulaire ci-dessous pour commander ce
                                            poisson.
                                        </p>
                                    </div>
                                </div>

                                <OrderForm fishId={fish.id} fishTitle={fish.title} />
                            </div>
                        )}

                        {user?.role === "SELLER" && (
                            <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                                        <Info className="h-5 w-5" />
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold tracking-tight text-slate-900">
                                            Information vendeur
                                        </h3>
                                        <p className="mt-1 text-sm leading-6 text-slate-600">
                                            Les vendeurs ne peuvent pas commander depuis cette page.
                                        </p>

                                        <div className="mt-4 rounded-3xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                                            Utilisez votre espace vendeur pour gérer vos annonces et
                                            suivre vos commandes reçues.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {user?.role === "ADMIN" && (
                            <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                                        <ShieldCheck className="h-5 w-5" />
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold tracking-tight text-slate-900">
                                            Compte administrateur connecté
                                        </h3>
                                        <p className="mt-1 text-sm leading-6 text-slate-600">
                                            Vous consultez cette annonce avec un profil administrateur.
                                        </p>

                                        <div className="mt-4 rounded-3xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                                            L’administration peut superviser la plateforme, mais ce
                                            compte n’est pas destiné à commander depuis cette page.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}