import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { redirect } from "next/navigation";
import AdminSidebar from "../../components/admin/AdminSidebar";
import Image from "next/image";
import {
  BadgeCheck,
  FishSymbol,
  MapPin,
  Package,
  Store,
  Tag,
  ShieldCheck,
  Eye,
  Clock3,
} from "lucide-react";

export default async function AdminFishesPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  const fishes = await prisma.fish.findMany({
    include: {
      seller: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const availableCount = fishes.filter((fish) => fish.available).length;
  const unavailableCount = fishes.filter((fish) => !fish.available).length;

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
                    <FishSymbol className="h-4 w-4" />
                    Administration des annonces
                  </div>

                  <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                    Poissons publiés
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                    Vue administrateur de toutes les annonces publiées sur Fish
                    Market San Pedro avec leurs vendeurs, prix, quantités et états
                    de disponibilité.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
                      Total
                    </p>
                    <p className="mt-2 text-2xl font-bold">{fishes.length}</p>
                    <p className="mt-1 text-sm text-white/75">annonces</p>
                  </div>

                  <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
                      Disponibles
                    </p>
                    <p className="mt-2 text-2xl font-bold">{availableCount}</p>
                    <p className="mt-1 text-sm text-white/75">encore visibles</p>
                  </div>

                  <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
                      Indisponibles
                    </p>
                    <p className="mt-2 text-2xl font-bold">{unavailableCount}</p>
                    <p className="mt-1 text-sm text-white/75">hors vente</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                    <FishSymbol className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900">
                      Vue d’ensemble des annonces
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Une lecture rapide de l’état actuel des poissons publiés sur
                      la plateforme.
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Total
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {fishes.length}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      annonce{fishes.length > 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Disponibles
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {availableCount}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      visibles au catalogue
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Indisponibles
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {unavailableCount}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      vendues ou désactivées
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
                      Cette page permet de superviser les annonces et leur état
                      global sur la marketplace.
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <h3 className="text-sm font-semibold text-slate-900">
                      Vendeur identifié
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Chaque annonce reste liée à un vendeur clairement affiché.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <h3 className="text-sm font-semibold text-slate-900">
                      État visible
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Les badges permettent de distinguer rapidement les annonces
                      encore disponibles de celles déjà indisponibles.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <h3 className="text-sm font-semibold text-slate-900">
                      Contrôle produit
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      L’admin peut lire les informations prix, quantité, lieu et
                      diffusion globale des annonces.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-6 py-5">
                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                  Toutes les annonces publiées
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {fishes.length} annonce{fishes.length > 1 ? "s" : ""} enregistrée{fishes.length > 1 ? "s" : ""} sur la plateforme.
                </p>
              </div>

              <div className="grid gap-6 p-6 md:grid-cols-2 xl:grid-cols-3">
                {fishes.map((fish) => (
                  <article
                    key={fish.id}
                    className="group overflow-hidden rounded-4xl border border-slate-200 bg-slate-50 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
                  >
                    {fish.imageUrl ? (
                      <div className="relative h-56 w-full overflow-hidden">
                        <Image
                          src={fish.imageUrl}
                          alt={fish.title}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />

                        <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800 shadow-sm backdrop-blur">
                          <FishSymbol className="h-3.5 w-3.5" />
                          {fish.species}
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-56 w-full items-center justify-center bg-slate-100 text-slate-400">
                        <FishSymbol className="h-10 w-10" />
                      </div>
                    )}

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-xl font-semibold tracking-tight text-slate-900">
                          {fish.title}
                        </h3>

                        <span
                          className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-semibold ${fish.available
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                            }`}
                        >
                          {fish.available ? "Disponible" : "Indisponible"}
                        </span>
                      </div>

                      <p className="mt-3 inline-flex items-center gap-2 text-sm text-slate-600">
                        <Store className="h-4 w-4 text-slate-400" />
                        vendeur : {fish.seller.name}
                      </p>

                      <div className="mt-5 grid gap-3 rounded-2xl bg-white p-4 text-sm text-slate-700">
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
                          <span className="font-medium text-slate-900">
                            {fish.quantity} {fish.unit}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                          <span className="inline-flex items-center gap-2 text-slate-500">
                            <MapPin className="h-4 w-4" />
                            Lieu
                          </span>
                          <span className="font-medium text-slate-900">
                            {fish.location || "—"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between gap-3 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-2">
                          <Eye className="h-3.5 w-3.5" />
                          Annonce #{fish.id}
                        </span>

                        <span className="inline-flex items-center gap-2">
                          {fish.available ? (
                            <BadgeCheck className="h-3.5 w-3.5" />
                          ) : (
                            <Clock3 className="h-3.5 w-3.5" />
                          )}
                          Suivi admin
                        </span>
                      </div>
                    </div>
                  </article>
                ))}

                {fishes.length === 0 && (
                  <div className="col-span-full px-2 py-8 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                      <FishSymbol className="h-7 w-7" />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-slate-900">
                      Aucune annonce publiée
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      Les annonces créées sur la plateforme apparaîtront ici.
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