import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { redirect } from "next/navigation";
import AdminSidebar from "../../components/admin/AdminSidebar";
import {
  FishSymbol,
  MessageCircle,
  MessageCircleMore,
  ShieldCheck,
  Store,
  UserRound,
  Clock3,
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

export default async function AdminConversationsPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  const conversations = await prisma.conversation.findMany({
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

  const withLastMessage = conversations.filter((c) => c.messages.length > 0).length;
  const withoutLastMessage = conversations.length - withLastMessage;

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <AdminSidebar />

          <section>
            <div className="overflow-hidden rounded-4xl border border-slate-200 bg-linear-to-r from-slate-900 via-slate-800 to-sky-900 text-white shadow-lg">
              <div className="flex flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-8 md:py-10">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur">
                    <MessageCircle className="h-4 w-4" />
                    Administration des conversations
                  </div>

                  <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                    Conversations
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                    Vue administrateur des échanges entre acheteurs et vendeurs
                    autour des annonces publiées sur Fish Market San Pedro.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
                      Total
                    </p>
                    <p className="mt-2 text-2xl font-bold">{conversations.length}</p>
                    <p className="mt-1 text-sm text-white/75">conversations</p>
                  </div>

                  <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
                      Actives
                    </p>
                    <p className="mt-2 text-2xl font-bold">{withLastMessage}</p>
                    <p className="mt-1 text-sm text-white/75">avec message</p>
                  </div>

                  <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
                      Vides
                    </p>
                    <p className="mt-2 text-2xl font-bold">{withoutLastMessage}</p>
                    <p className="mt-1 text-sm text-white/75">sans contenu</p>
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
                      Vue d’ensemble des échanges
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Une lecture rapide de l’activité conversationnelle de la
                      plateforme.
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
                      Avec messages
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {withLastMessage}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      échanges actifs
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Sans message
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {withoutLastMessage}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      démarrages incomplets
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                    <ShieldCheck className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900">
                      Lecture admin
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Cette vue permet de surveiller les échanges entre les
                      différents acteurs de la marketplace.
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <h3 className="text-sm font-semibold text-slate-900">
                      Conversation liée à une annonce
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Chaque échange reste rattaché à un poisson précis publié sur
                      la plateforme.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <h3 className="text-sm font-semibold text-slate-900">
                      Participants identifiés
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      L’admin visualise clairement l’acheteur, le vendeur et le
                      dernier contenu échangé.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <h3 className="text-sm font-semibold text-slate-900">
                      Activité récente
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Le tri par mise à jour récente met en avant les échanges les
                      plus actifs.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-6 py-5">
                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                  Toutes les conversations
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {conversations.length} conversation{conversations.length > 1 ? "s" : ""} enregistrée{conversations.length > 1 ? "s" : ""} sur la plateforme.
                </p>
              </div>

              <div className="grid gap-4 p-6">
                {conversations.map((conversation) => {
                  const lastMessage = conversation.messages[0];
                  const buyerInitials = getInitials(conversation.buyer.name);
                  const sellerInitials = getInitials(conversation.seller.name);

                  return (
                    <article
                      key={conversation.id}
                      className="rounded-4xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-xl font-semibold tracking-tight text-slate-900">
                              {conversation.fish.title}
                            </h3>

                            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                              Conversation #{conversation.id}
                            </span>
                          </div>

                          <div className="mt-4 grid gap-4 md:grid-cols-2">
                            <div className="rounded-2xl bg-white p-4">
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Acheteur
                              </p>
                              <div className="mt-3 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sm font-bold text-sky-700">
                                  {buyerInitials}
                                </div>
                                <div>
                                  <p className="inline-flex items-center gap-2 text-sm font-medium text-slate-900">
                                    <UserRound className="h-4 w-4 text-slate-400" />
                                    {conversation.buyer.name}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="rounded-2xl bg-white p-4">
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Vendeur
                              </p>
                              <div className="mt-3 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-sm font-bold text-emerald-700">
                                  {sellerInitials}
                                </div>
                                <div>
                                  <p className="inline-flex items-center gap-2 text-sm font-medium text-slate-900">
                                    <Store className="h-4 w-4 text-slate-400" />
                                    {conversation.seller.name}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 rounded-2xl bg-white p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Dernier message
                            </p>
                            <p className="mt-2 text-sm leading-7 text-slate-600">
                              {lastMessage?.content || "Aucun message"}
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2 text-xs text-slate-400">
                          <Clock3 className="h-3.5 w-3.5" />
                          {formatConversationDate(conversation.updatedAt)}
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between gap-3 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-2">
                          <FishSymbol className="h-3.5 w-3.5" />
                          Annonce liée
                        </span>

                        <span className="inline-flex items-center gap-2">
                          <MessageCircleMore className="h-3.5 w-3.5" />
                          Suivi admin
                        </span>
                      </div>
                    </article>
                  );
                })}

                {conversations.length === 0 && (
                  <div className="px-2 py-8 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                      <MessageCircle className="h-7 w-7" />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-slate-900">
                      Aucune conversation enregistrée
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      Les échanges entre utilisateurs apparaîtront ici dès qu’une
                      conversation sera créée.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}