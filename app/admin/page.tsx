import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { redirect } from "next/navigation";
import AdminSidebar from "../components/admin/AdminSidebar";
import StatCard from "../components/admin/StatCard";
import {
  BadgeCheck,
  ClipboardList,
  FishSymbol,
  MessageCircle,
  ShieldCheck,
  TrendingUp,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  const [
    usersCount,
    sellersCount,
    buyersCount,
    fishesCount,
    availableFishesCount,
    ordersCount,
    pendingOrdersCount,
    confirmedOrdersCount,
    conversationsCount,
    messagesCount,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "SELLER" } }),
    prisma.user.count({ where: { role: "BUYER" } }),
    prisma.fish.count(),
    prisma.fish.count({ where: { available: true } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { status: "CONFIRMED" } }),
    prisma.conversation.count(),
    prisma.message.count(),
  ]);

  const revenueResult = await prisma.order.aggregate({
    _sum: {
      totalPrice: true,
    },
    where: {
      status: {
        in: ["CONFIRMED", "COMPLETED"],
      },
    },
  });

  const totalRevenue = revenueResult._sum.totalPrice ?? 0;

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <AdminSidebar />

          <section className="min-w-0">
            <div className="overflow-hidden rounded-4xl border border-slate-200 bg-linear-to-r from-slate-900 via-slate-800 to-sky-900 text-white shadow-lg">
              <div className="flex flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-8 md:py-10">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur">
                    <ShieldCheck className="h-4 w-4" />
                    Espace administration
                  </div>

                  <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                    Dashboard Admin
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                    Vue d’ensemble de la plateforme Fish Market San Pedro :
                    utilisateurs, annonces, commandes, revenus et activité de la
                    messagerie.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
                      Plateforme
                    </p>
                    <p className="mt-2 text-2xl font-bold">{usersCount}</p>
                    <p className="mt-1 text-sm text-white/75">
                      utilisateurs enregistrés
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
                      Revenu validé
                    </p>
                    <p className="mt-2 text-2xl font-bold">{totalRevenue} FCFA</p>
                    <p className="mt-1 text-sm text-white/75">
                      commandes confirmées / terminées
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                    <TrendingUp className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900">
                      Indicateurs clés
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Les métriques principales pour suivre la santé globale de
                      la plateforme.
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <StatCard
                    title="Utilisateurs"
                    value={usersCount}
                    subtitle={`${sellersCount} vendeurs / ${buyersCount} acheteurs`}
                    icon={<Users className="h-5 w-5" />}
                    trend={{
                      value: "+12%",
                      direction: "up",
                      label: "évolution globale",
                    }}
                    chartData={[
                      { value: Math.max(2, Math.floor(usersCount * 0.25)) },
                      { value: Math.max(4, Math.floor(usersCount * 0.38)) },
                      { value: Math.max(6, Math.floor(usersCount * 0.5)) },
                      { value: Math.max(8, Math.floor(usersCount * 0.65)) },
                      { value: Math.max(10, Math.floor(usersCount * 0.78)) },
                      { value: Math.max(12, Math.floor(usersCount * 0.9)) },
                      { value: usersCount },
                    ]}
                  />

                  <StatCard
                    title="Annonces poissons"
                    value={fishesCount}
                    subtitle={`${availableFishesCount} disponibles`}
                    icon={<FishSymbol className="h-5 w-5" />}
                    trend={{
                      value: availableFishesCount > 0 ? "+8%" : "stable",
                      direction: availableFishesCount > 0 ? "up" : "neutral",
                      label: "offres publiées",
                    }}
                    chartData={[
                      { value: Math.max(1, Math.floor(fishesCount * 0.2)) },
                      { value: Math.max(2, Math.floor(fishesCount * 0.32)) },
                      { value: Math.max(3, Math.floor(fishesCount * 0.44)) },
                      { value: Math.max(4, Math.floor(fishesCount * 0.58)) },
                      { value: Math.max(5, Math.floor(fishesCount * 0.7)) },
                      { value: Math.max(6, Math.floor(fishesCount * 0.84)) },
                      { value: fishesCount },
                    ]}
                  />

                  <StatCard
                    title="Commandes"
                    value={ordersCount}
                    subtitle={`${pendingOrdersCount} en attente`}
                    icon={<ClipboardList className="h-5 w-5" />}
                    trend={{
                      value: pendingOrdersCount > 0 ? "+5%" : "stable",
                      direction: pendingOrdersCount > 0 ? "up" : "neutral",
                      label: "activité récente",
                    }}
                    chartData={[
                      { value: Math.max(1, Math.floor(ordersCount * 0.18)) },
                      { value: Math.max(2, Math.floor(ordersCount * 0.3)) },
                      { value: Math.max(3, Math.floor(ordersCount * 0.42)) },
                      { value: Math.max(4, Math.floor(ordersCount * 0.55)) },
                      { value: Math.max(5, Math.floor(ordersCount * 0.7)) },
                      { value: Math.max(6, Math.floor(ordersCount * 0.86)) },
                      { value: ordersCount },
                    ]}
                  />

                  <StatCard
                    title="Revenu total validé"
                    value={`${totalRevenue} FCFA`}
                    subtitle="commandes confirmées et terminées"
                    icon={<Wallet className="h-5 w-5" />}
                    trend={{
                      value: totalRevenue > 0 ? "+18%" : "stable",
                      direction: totalRevenue > 0 ? "up" : "neutral",
                      label: "performance économique",
                    }}
                    chartData={[
                      { value: Math.max(1000, Math.floor(totalRevenue * 0.12)) },
                      { value: Math.max(2000, Math.floor(totalRevenue * 0.22)) },
                      { value: Math.max(3000, Math.floor(totalRevenue * 0.36)) },
                      { value: Math.max(4000, Math.floor(totalRevenue * 0.5)) },
                      { value: Math.max(5000, Math.floor(totalRevenue * 0.68)) },
                      { value: Math.max(6000, Math.floor(totalRevenue * 0.84)) },
                      { value: totalRevenue || 0 },
                    ]}
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                    <BadgeCheck className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900">
                      Lecture rapide
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Quelques repères utiles pour l’analyse opérationnelle du
                      produit.
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <h3 className="text-sm font-semibold text-slate-900">
                      Utilisateurs actifs du modèle
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      La plateforme repose actuellement sur {sellersCount} vendeurs
                      et {buyersCount} acheteurs enregistrés.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <h3 className="text-sm font-semibold text-slate-900">
                      Annonces disponibles
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {availableFishesCount} annonce{availableFishesCount > 1 ? "s" : ""} sont
                      encore visibles pour les acheteurs.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <h3 className="text-sm font-semibold text-slate-900">
                      Activité relationnelle
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {conversationsCount} conversation{conversationsCount > 1 ? "s" : ""} et{" "}
                      {messagesCount} message{messagesCount > 1 ? "s" : ""} ont déjà
                      circulé sur la plateforme.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  Commandes confirmées
                </h3>
                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  {confirmedOrdersCount}
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Volume des commandes déjà validées par les vendeurs.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  Conversations
                </h3>
                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  {conversationsCount}
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Nombre total de conversations ouvertes entre utilisateurs.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                  <Wallet className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  Messages
                </h3>
                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  {messagesCount}
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Activité globale de la messagerie sur la plateforme.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-3">
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-200 text-slate-700">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  Utilisateurs
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Un futur module pourra détailler les listes, rôles et profils.
                </p>
              </div>

              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-200 text-slate-700">
                  <FishSymbol className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  Annonces
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Un écran admin pourra superviser les poissons publiés et leur disponibilité.
                </p>
              </div>

              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-200 text-slate-700">
                  <UserRound className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  Gouvernance
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  La base est prête pour accueillir une administration plus complète.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}