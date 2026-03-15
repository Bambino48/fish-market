import { getCurrentUser } from "@/lib/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    FishSymbol,
    MessageCircle,
    MessageCircleMore,
    Store,
    UserRound,
} from "lucide-react";

function getInitials(name?: string | null) {
    if (!name) return "FM";

    const parts = name.trim().split(" ").filter(Boolean);

    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }

    return (parts[0][0] + parts[1][0]).toUpperCase();
}

function formatConversationDate(date: Date) {
    return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

export default async function MessagesPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    const conversations = await prisma.conversation.findMany({
        where: {
            OR: [{ buyerId: user.id }, { sellerId: user.id }],
        },
        include: {
            fish: true,
            buyer: true,
            seller: true,
            messages: {
                orderBy: {
                    createdAt: "desc",
                },
                take: 1,
            },
        },
        orderBy: {
            updatedAt: "desc",
        },
    });

    return (
        <main className="bg-slate-50">
            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                <div className="overflow-hidden rounded-4xl border border-slate-200 bg-linear-to-r from-slate-900 via-slate-800 to-sky-900 text-white shadow-lg">
                    <div className="flex flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-8 md:py-10">
                        <div className="max-w-3xl">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur">
                                <MessageCircle className="h-4 w-4" />
                                Espace messages
                            </div>

                            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                                Messages
                            </h1>

                            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                                Retrouvez toutes vos conversations liées aux annonces Fish Market
                                et accédez rapidement à vos échanges avec acheteurs ou vendeurs.
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

                            <div className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white">
                                <MessageCircleMore className="h-4 w-4" />
                                {conversations.length} conversation{conversations.length > 1 ? "s" : ""}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                                <MessageCircle className="h-5 w-5" />
                            </div>

                            <div>
                                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                                    Vos échanges
                                </h2>
                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                    Cette page centralise toutes vos conversations liées aux
                                    annonces de la plateforme.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-3">
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Total
                                </p>
                                <p className="mt-2 text-2xl font-bold text-slate-900">
                                    {conversations.length}
                                </p>
                                <p className="mt-1 text-sm text-slate-600">
                                    conversation{conversations.length > 1 ? "s" : ""}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Profil
                                </p>
                                <p className="mt-2 text-base font-bold text-slate-900">
                                    {user.role === "SELLER"
                                        ? "Vendeur"
                                        : user.role === "BUYER"
                                            ? "Acheteur"
                                            : "Utilisateur"}
                                </p>
                                <p className="mt-1 text-sm text-slate-600">
                                    connecté
                                </p>
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Accès rapide
                                </p>
                                <p className="mt-2 text-base font-bold text-slate-900">
                                    Messages
                                </p>
                                <p className="mt-1 text-sm text-slate-600">
                                    centralisés
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                                <Store className="h-5 w-5" />
                            </div>

                            <div>
                                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                                    Bon à savoir
                                </h2>
                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                    Utilisez la messagerie pour clarifier les détails d’une annonce
                                    avant ou après une commande.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <h3 className="text-sm font-semibold text-slate-900">
                                    Conversations liées aux annonces
                                </h3>
                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    Chaque conversation est associée à une annonce précise.
                                </p>
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-4">
                                <h3 className="text-sm font-semibold text-slate-900">
                                    Réactivité recommandée
                                </h3>
                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    Répondre rapidement améliore la confiance et la fluidité des échanges.
                                </p>
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-4">
                                <h3 className="text-sm font-semibold text-slate-900">
                                    Accès aux détails
                                </h3>
                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    Ouvrez chaque conversation pour lire l’historique complet et répondre.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                            Liste des conversations
                        </h2>
                        <p className="mt-1 text-sm text-slate-600">
                            {conversations.length === 0
                                ? "Aucune conversation enregistrée pour le moment."
                                : `${conversations.length} conversation${conversations.length > 1 ? "s" : ""} trouvée${conversations.length > 1 ? "s" : ""}.`}
                        </p>
                    </div>
                </div>

                <div className="mt-6">
                    {conversations.length === 0 ? (
                        <div className="rounded-4xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                                <MessageCircle className="h-7 w-7" />
                            </div>

                            <h3 className="mt-5 text-xl font-semibold text-slate-900">
                                Aucune conversation pour le moment
                            </h3>

                            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">
                                Vos échanges avec acheteurs ou vendeurs apparaîtront ici dès
                                qu’une conversation sera démarrée depuis une annonce.
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
                        <div className="grid gap-4">
                            {conversations.map((conversation) => {
                                const otherUser =
                                    conversation.buyerId === user.id
                                        ? conversation.seller
                                        : conversation.buyer;

                                const lastMessage = conversation.messages[0];
                                const initials = getInitials(otherUser.name);

                                return (
                                    <Link
                                        key={conversation.id}
                                        href={`/dashboard/messages/${conversation.id}`}
                                        className="group rounded-4xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                                    >
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="flex min-w-0 items-start gap-4">
                                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-base font-bold text-sky-700">
                                                    {initials}
                                                </div>

                                                <div className="min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h3 className="text-xl font-semibold tracking-tight text-slate-900">
                                                            {conversation.fish.title}
                                                        </h3>
                                                        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                                                            Conversation #{conversation.id}
                                                        </span>
                                                    </div>

                                                    <p className="mt-1 inline-flex items-center gap-2 text-sm text-slate-600">
                                                        {conversation.buyerId === user.id ? (
                                                            <Store className="h-4 w-4 text-slate-400" />
                                                        ) : (
                                                            <UserRound className="h-4 w-4 text-slate-400" />
                                                        )}
                                                        Conversation avec {otherUser.name}
                                                    </p>

                                                    <p className="mt-3 line-clamp-2 text-sm leading-7 text-slate-500">
                                                        {lastMessage?.content || "Aucun message"}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                                                <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                                                    <MessageCircleMore className="h-3.5 w-3.5" />
                                                    Ouvrir
                                                </div>

                                                <p className="text-xs text-slate-400">
                                                    {formatConversationDate(conversation.updatedAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}