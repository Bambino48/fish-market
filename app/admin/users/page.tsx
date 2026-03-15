import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { redirect } from "next/navigation";
import AdminSidebar from "../../components/admin/AdminSidebar";
import {
  BadgeCheck,
  MapPin,
  Phone,
  ShieldCheck,
  Store,
  UserRound,
  Users,
} from "lucide-react";

function getRoleLabel(role: string) {
  switch (role) {
    case "SELLER":
      return "Vendeur";
    case "BUYER":
      return "Acheteur";
    case "ADMIN":
      return "Administrateur";
    default:
      return role;
  }
}

function getRoleTone(role: string) {
  switch (role) {
    case "SELLER":
      return "bg-emerald-50 text-emerald-700";
    case "BUYER":
      return "bg-sky-50 text-sky-700";
    case "ADMIN":
      return "bg-violet-50 text-violet-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function getInitials(name?: string | null) {
  if (!name) return "FM";

  const parts = name.trim().split(" ").filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default async function AdminUsersPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const sellersCount = users.filter((u) => u.role === "SELLER").length;
  const buyersCount = users.filter((u) => u.role === "BUYER").length;
  const adminsCount = users.filter((u) => u.role === "ADMIN").length;

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
                    <Users className="h-4 w-4" />
                    Administration des utilisateurs
                  </div>

                  <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                    Utilisateurs
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                    Consultez la liste complète des comptes enregistrés sur Fish
                    Market San Pedro avec leurs rôles et informations
                    principales.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
                      Total
                    </p>
                    <p className="mt-2 text-2xl font-bold">{users.length}</p>
                    <p className="mt-1 text-sm text-white/75">utilisateurs</p>
                  </div>

                  <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
                      Vendeurs
                    </p>
                    <p className="mt-2 text-2xl font-bold">{sellersCount}</p>
                    <p className="mt-1 text-sm text-white/75">comptes seller</p>
                  </div>

                  <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
                      Acheteurs
                    </p>
                    <p className="mt-2 text-2xl font-bold">{buyersCount}</p>
                    <p className="mt-1 text-sm text-white/75">comptes buyer</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                    <Users className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900">
                      Répartition rapide
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Quelques indicateurs utiles pour comprendre la structure
                      actuelle des comptes.
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Vendeurs
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {sellersCount}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      comptes actifs métier
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Acheteurs
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {buyersCount}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      profils d’achat
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Admins
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {adminsCount}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      supervision plateforme
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
                      Cette page permet de visualiser rapidement les rôles et les
                      principales informations de contact.
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <h3 className="text-sm font-semibold text-slate-900">
                      Identification simple
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Chaque utilisateur affiche son nom, son rôle, son téléphone
                      et sa ville.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <h3 className="text-sm font-semibold text-slate-900">
                      Lecture métier
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Les badges de rôle facilitent le tri visuel entre vendeurs,
                      acheteurs et administrateurs.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <h3 className="text-sm font-semibold text-slate-900">
                      Évolutif
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Cette base pourra ensuite accueillir recherche, filtres et
                      actions de gestion plus avancées.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-6 py-5">
                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                  Liste complète des comptes
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {users.length} utilisateur{users.length > 1 ? "s" : ""} enregistré{users.length > 1 ? "s" : ""}.
                </p>
              </div>

              <div className="divide-y divide-slate-200">
                {users.map((u) => (
                  <div
                    key={u.id}
                    className="px-6 py-5 transition hover:bg-slate-50"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex min-w-0 items-start gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-base font-bold text-sky-700">
                          {getInitials(u.name)}
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-lg font-semibold text-slate-900">
                              {u.name}
                            </h3>
                            <span
                              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getRoleTone(
                                u.role
                              )}`}
                            >
                              {getRoleLabel(u.role)}
                            </span>
                          </div>

                          <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2 xl:grid-cols-4">
                            <p className="inline-flex items-center gap-2">
                              <Phone className="h-4 w-4 text-slate-400" />
                              {u.phone}
                            </p>

                            <p className="inline-flex items-center gap-2">
                              <UserRound className="h-4 w-4 text-slate-400" />
                              {u.email || "Email non renseigné"}
                            </p>

                            <p className="inline-flex items-center gap-2">
                              {u.role === "SELLER" ? (
                                <Store className="h-4 w-4 text-slate-400" />
                              ) : (
                                <BadgeCheck className="h-4 w-4 text-slate-400" />
                              )}
                              {getRoleLabel(u.role)}
                            </p>

                            <p className="inline-flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-slate-400" />
                              {u.city || "Ville non renseignée"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {users.length === 0 && (
                  <div className="px-6 py-10 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                      <Users className="h-7 w-7" />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-slate-900">
                      Aucun utilisateur enregistré
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      Les comptes créés sur la plateforme apparaîtront ici.
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