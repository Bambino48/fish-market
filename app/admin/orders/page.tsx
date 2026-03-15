import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { redirect } from "next/navigation";
import AdminSidebar from "../../components/admin/AdminSidebar";
import OrderStatusBadge from "../../components/orders/OrderStatusBadge";
import {
  ClipboardList,
  FishSymbol,
  Package,
  Store,
  UserRound,
  Wallet,
  ShieldCheck,
  Clock3,
  CheckCircle2,
} from "lucide-react";

export default async function AdminOrdersPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  const orders = await prisma.order.findMany({
    include: {
      fish: true,
      buyer: true,
      seller: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const pendingCount = orders.filter((order) => order.status === "PENDING").length;
  const confirmedCount = orders.filter((order) => order.status === "CONFIRMED").length;
  const completedCount = orders.filter((order) => order.status === "COMPLETED").length;

  const totalRevenue = orders
    .filter((order) => order.status === "CONFIRMED" || order.status === "COMPLETED")
    .reduce((sum, order) => sum + order.totalPrice, 0);

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
                    <ClipboardList className="h-4 w-4" />
                    Administration des commandes
                  </div>

                  <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                    Commandes
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                    Suivez l’ensemble des commandes de la plateforme Fish Market
                    San Pedro avec une vue claire sur les acheteurs, vendeurs,
                    statuts et montants.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
                      Total commandes
                    </p>
                    <p className="mt-2 text-2xl font-bold">{orders.length}</p>
                    <p className="mt-1 text-sm text-white/75">transactions enregistrées</p>
                  </div>

                  <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
                      Revenu visible
                    </p>
                    <p className="mt-2 text-2xl font-bold">{totalRevenue} FCFA</p>
                    <p className="mt-1 text-sm text-white/75">confirmé ou terminé</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                    <ClipboardList className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900">
                      Indicateurs commandes
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Une lecture rapide de l’activité transactionnelle de la plateforme.
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-4">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Total
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {orders.length}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">commandes</p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      En attente
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {pendingCount}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">à traiter</p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Confirmées
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {confirmedCount}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">validées</p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Terminées
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {completedCount}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">finalisées</p>
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
                      Cette vue permet de surveiller l’état global des transactions.
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <h3 className="text-sm font-semibold text-slate-900">
                      Identification des parties
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Chaque commande affiche l’acheteur, le vendeur et l’annonce liée.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <h3 className="text-sm font-semibold text-slate-900">
                      Suivi des statuts
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Les badges facilitent la lecture des commandes en attente, confirmées ou terminées.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <h3 className="text-sm font-semibold text-slate-900">
                      Vision financière
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Le montant total permet une lecture rapide du volume économique traité.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-6 py-5">
                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                  Toutes les commandes
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {orders.length} commande{orders.length > 1 ? "s" : ""} enregistrée{orders.length > 1 ? "s" : ""} sur la plateforme.
                </p>
              </div>

              <div className="grid gap-6 p-6 md:grid-cols-2">
                {orders.map((order) => (
                  <article
                    key={order.id}
                    className="rounded-4xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-xl font-semibold tracking-tight text-slate-900">
                        {order.fish.title}
                      </h3>
                      <OrderStatusBadge status={order.status} />
                    </div>

                    <div className="mt-5 grid gap-3 rounded-3xl bg-white p-5 text-sm text-slate-700">
                      <div className="flex items-center justify-between gap-3">
                        <span className="inline-flex items-center gap-2 text-slate-500">
                          <UserRound className="h-4 w-4" />
                          Acheteur
                        </span>
                        <span className="font-medium text-slate-900">
                          {order.buyer.name}
                        </span>
                      </div>

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
                          <Package className="h-4 w-4" />
                          Quantité
                        </span>
                        <span className="font-medium text-slate-900">
                          {order.quantity}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <span className="inline-flex items-center gap-2 text-slate-500">
                          <Wallet className="h-4 w-4" />
                          Total
                        </span>
                        <span className="font-semibold text-slate-900">
                          {order.totalPrice} FCFA
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-3 text-xs text-slate-400">
                      <span className="inline-flex items-center gap-2">
                        <FishSymbol className="h-3.5 w-3.5" />
                        Commande #{order.id}
                      </span>

                      <span className="inline-flex items-center gap-2">
                        {order.status === "PENDING" ? (
                          <Clock3 className="h-3.5 w-3.5" />
                        ) : (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        )}
                        Statut suivi
                      </span>
                    </div>
                  </article>
                ))}

                {orders.length === 0 && (
                  <div className="col-span-full px-2 py-8 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                      <ClipboardList className="h-7 w-7" />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-slate-900">
                      Aucune commande enregistrée
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      Les commandes créées sur la plateforme apparaîtront ici.
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