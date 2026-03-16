import { getCurrentUser } from "@/lib/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ReplyMessageForm from "../../../components/messages/ReplyMessageForm";
import {
    ArrowLeft,
    FishSymbol,
    MessageCircle,
    Phone,
    Store,
    UserRound,
} from "lucide-react";

type ConversationPageProps = {
    params: Promise<{
        id: string;
    }>;
};

function formatMessageDate(date: Date) {
    return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

function getInitials(name?: string | null) {
    if (!name) return "FM";

    const parts = name.trim().split(" ").filter(Boolean);

    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }

    return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default async function ConversationPage({
    params,
}: ConversationPageProps) {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    const { id } = await params;
    const conversationId = Number(id);

    if (isNaN(conversationId)) {
        notFound();
    }

    const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: {
            fish: true,
            buyer: true,
            seller: true,
            messages: {
                include: {
                    sender: true,
                },
                orderBy: {
                    createdAt: "asc",
                },
            },
        },
    });

    if (!conversation) {
        notFound();
    }

    const isAllowed =
        conversation.buyerId === user.id || conversation.sellerId === user.id;

    if (!isAllowed) {
        redirect("/dashboard/messages");
    }

    return (
        <main className="bg-slate-50">
            <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                <div className="overflow-hidden rounded-4xl border border-slate-200 bg-linear-to-r from-slate-900 via-slate-800 to-sky-900 text-white shadow-lg">
                    <div className="flex flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-8 md:py-10">
                        <div className="max-w-3xl">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur">
                                <MessageCircle className="h-4 w-4" />
                                Conversation active
                            </div>

                            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                                {conversation.fish.title}
                            </h1>

                            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                                Retrouvez ici l’historique complet des échanges entre acheteur et
                                vendeur pour cette annonce.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="/dashboard/messages"
                                className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Retour messages
                            </Link>

                            <Link
                                href={`/fishes/${conversation.fish.id}`}
                                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                            >
                                <FishSymbol className="h-4 w-4" />
                                Voir l’annonce
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
                    <aside className="space-y-6">
                        <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                                    <FishSymbol className="h-5 w-5" />
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold tracking-tight text-slate-900">
                                        À propos de l’annonce
                                    </h2>
                                    <p className="mt-1 text-sm leading-6 text-slate-600">
                                        Cette conversation est liée à l’annonce sélectionnée.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 rounded-3xl bg-slate-50 p-5">
                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-sm text-slate-500">Titre</span>
                                    <span className="text-sm font-semibold text-slate-900">
                                        {conversation.fish.title}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                                    <Store className="h-5 w-5" />
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold tracking-tight text-slate-900">
                                        Participants
                                    </h2>
                                    <p className="mt-1 text-sm leading-6 text-slate-600">
                                        Consultez rapidement les personnes impliquées dans cet échange.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 space-y-4">
                                <div className="rounded-3xl bg-slate-50 p-5">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Acheteur
                                    </p>
                                    <div className="mt-3 flex items-center gap-3">
                                        <div className="relative h-12 w-12 overflow-hidden rounded-2xl bg-sky-100 ring-1 ring-slate-200">
                                            {conversation.buyer.profileImageUrl ? (
                                                <Image
                                                    src={conversation.buyer.profileImageUrl}
                                                    alt={conversation.buyer.name || "Photo de profil"}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-sm font-bold text-sky-700">
                                                    {getInitials(conversation.buyer.name)}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-1 text-sm">
                                            <p className="inline-flex items-center gap-2 text-slate-700">
                                                <UserRound className="h-4 w-4 text-slate-500" />
                                                {conversation.buyer.name}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-3xl bg-slate-50 p-5">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Vendeur
                                    </p>

                                    <div className="mt-3 flex items-start gap-3">
                                        <div className="relative h-12 w-12 overflow-hidden rounded-2xl bg-emerald-100 ring-1 ring-slate-200">
                                            {conversation.seller.profileImageUrl ? (
                                                <Image
                                                    src={conversation.seller.profileImageUrl}
                                                    alt={conversation.seller.name || "Photo de profil"}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-sm font-bold text-emerald-700">
                                                    {getInitials(conversation.seller.name)}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-3 text-sm">
                                            <p className="inline-flex items-center gap-2 text-slate-700">
                                                <Store className="h-4 w-4 text-slate-500" />
                                                {conversation.seller.name}
                                            </p>
                                            <p className="inline-flex items-center gap-2 text-slate-700">
                                                <Phone className="h-4 w-4 text-slate-500" />
                                                {conversation.seller.phone}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                                    Messages
                                </h2>
                                <p className="mt-1 text-sm text-slate-600">
                                    {conversation.messages.length === 0
                                        ? "Aucun message dans cette conversation."
                                        : `${conversation.messages.length} message${conversation.messages.length > 1 ? "s" : ""} dans cet échange.`}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 rounded-[1.75rem] bg-slate-50 p-4 sm:p-5">
                            <div className="space-y-4">
                                {conversation.messages.length === 0 ? (
                                    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
                                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                                            <MessageCircle className="h-6 w-6" />
                                        </div>

                                        <h3 className="mt-4 text-lg font-semibold text-slate-900">
                                            Aucun message pour le moment
                                        </h3>
                                        <p className="mt-2 text-sm leading-7 text-slate-600">
                                            Commencez l’échange en envoyant votre premier message ci-dessous.
                                        </p>
                                    </div>
                                ) : (
                                    conversation.messages.map((msg) => {
                                        const isMine = msg.senderId === user.id;
                                        const senderInitials = getInitials(msg.sender.name);

                                        return (
                                            <div
                                                key={msg.id}
                                                className={`flex items-end gap-3 ${isMine ? "justify-end" : "justify-start"}`}
                                            >
                                                {!isMine && (
                                                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-sky-100 ring-1 ring-slate-200">
                                                        {msg.sender.profileImageUrl ? (
                                                            <Image
                                                                src={msg.sender.profileImageUrl}
                                                                alt={msg.sender.name || "Photo de profil"}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-xs font-bold text-sky-700">
                                                                {senderInitials}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                <div
                                                    className={`max-w-[85%] rounded-3xl px-4 py-3 shadow-sm sm:max-w-[75%] ${isMine
                                                            ? "bg-sky-600 text-white"
                                                            : "bg-white text-slate-900"
                                                        }`}
                                                >
                                                    <div
                                                        className={`text-xs font-semibold ${isMine ? "text-white/90" : "text-slate-500"
                                                            }`}
                                                    >
                                                        {msg.sender.name}
                                                    </div>

                                                    <p className="mt-1 text-sm leading-7">{msg.content}</p>

                                                    <div
                                                        className={`mt-2 text-[11px] ${isMine ? "text-white/75" : "text-slate-400"
                                                            }`}
                                                    >
                                                        {formatMessageDate(msg.createdAt)}
                                                    </div>
                                                </div>

                                                {isMine && (
                                                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-sky-100 ring-1 ring-slate-200">
                                                        {msg.sender.profileImageUrl ? (
                                                            <Image
                                                                src={msg.sender.profileImageUrl}
                                                                alt={msg.sender.name || "Photo de profil"}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-xs font-bold text-sky-700">
                                                                {senderInitials}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                         <ReplyMessageForm
                            conversationId={conversation.id}
                            currentUserName={user.name}
                            currentUserProfileImageUrl={user.profileImageUrl}
                        />
                    </section>
                </div>
            </section>
        </main>
    );
}