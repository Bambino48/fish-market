import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminSidebar from "../../components/admin/AdminSidebar";
import VerificationActions from "../../components/admin/VerificationActions";
import {
  BadgeCheck,
  FileCheck2,
  Phone,
  MapPin,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";

function getStatusLabel(status: string) {
  switch (status) {
    case "NOT_SUBMITTED":
      return "Non soumis";
    case "PENDING":
      return "En attente";
    case "APPROVED":
      return "Approuvé";
    case "REJECTED":
      return "Rejeté";
    default:
      return status;
  }
}

function getStatusClass(status: string) {
  switch (status) {
    case "APPROVED":
      return "bg-emerald-100 text-emerald-700";
    case "PENDING":
      return "bg-amber-100 text-amber-700";
    case "REJECTED":
      return "bg-red-100 text-red-700";
    case "NOT_SUBMITTED":
      return "bg-slate-100 text-slate-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function getFileTypeLabel(type: string) {
  switch (type) {
    case "PERMIS":
      return "Permis de pêche";
    case "ID_CARD":
      return "Pièce d’identité";
    default:
      return type;
  }
}

export default async function AdminVerificationsPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  const documents = await prisma.verificationDocument.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const pendingCount = documents.filter((doc) => doc.status === "PENDING").length;
  const approvedCount = documents.filter((doc) => doc.status === "APPROVED").length;
  const rejectedCount = documents.filter((doc) => doc.status === "REJECTED").length;

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
                    Contrôle des vendeurs
                  </div>

                  <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                    Vérifications vendeurs
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                    Vérifiez les permis de pêche et gérez le processus de validation
                    des comptes vendeurs sur Fish Market.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
                      Total
                    </p>
                    <p className="mt-2 text-2xl font-bold">{documents.length}</p>
                    <p className="mt-1 text-sm text-white/75">pièces soumises</p>
                  </div>

                  <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
                      En attente
                    </p>
                    <p className="mt-2 text-2xl font-bold">{pendingCount}</p>
                    <p className="mt-1 text-sm text-white/75">à traiter</p>
                  </div>

                  <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
                      Approuvés
                    </p>
                    <p className="mt-2 text-2xl font-bold">{approvedCount}</p>
                    <p className="mt-1 text-sm text-white/75">validés</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                  <FileCheck2 className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-slate-900">
                  Dossiers en attente
                </h2>
                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  {pendingCount}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Documents nécessitant une action de validation ou de rejet.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <BadgeCheck className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-slate-900">
                  Comptes approuvés
                </h2>
                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  {approvedCount}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Vendeurs déjà validés par l’administration.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-700">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-slate-900">
                  Comptes rejetés
                </h2>
                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  {rejectedCount}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Dossiers non retenus ou nécessitant une nouvelle soumission.
                </p>
              </div>
            </div>

            <div className="mt-6">
              {documents.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                    <FileCheck2 className="h-6 w-6" />
                  </div>

                  <h2 className="mt-4 text-xl font-semibold text-slate-900">
                    Aucune pièce soumise
                  </h2>

                  <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-slate-600">
                    Les demandes de vérification des vendeurs apparaîtront ici
                    dès qu’un document sera envoyé.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {documents.map((doc) => {
                    const statusLabel = getStatusLabel(doc.status);
                    const statusClass = getStatusClass(doc.status);

                    return (
                      <div
                        key={doc.id}
                        className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-3">
                              <h2 className="text-xl font-semibold text-slate-900">
                                {doc.user.name}
                              </h2>

                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}
                              >
                                {statusLabel}
                              </span>
                            </div>

                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                              <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                  Téléphone
                                </p>
                                <p className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-slate-800">
                                  <Phone className="h-4 w-4 text-slate-500" />
                                  {doc.user.phone}
                                </p>
                              </div>

                              <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                  Ville
                                </p>
                                <p className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-slate-800">
                                  <MapPin className="h-4 w-4 text-slate-500" />
                                  {doc.user.city || "—"}
                                </p>
                              </div>

                              <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                  Type de document
                                </p>
                                <p className="mt-2 text-sm font-medium text-slate-800">
                                  {getFileTypeLabel(doc.fileType)}
                                </p>
                              </div>

                              <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                  Statut actuel
                                </p>
                                <p className="mt-2 text-sm font-medium text-slate-800">
                                  {statusLabel}
                                </p>
                              </div>
                            </div>

                            {doc.note && (
                              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                  Note admin
                                </p>
                                <p className="mt-2 text-sm leading-6 text-slate-700">
                                  {doc.note}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="w-full shrink-0 lg:w-72">
                            <div className="rounded-2xl bg-slate-50 p-4">
                              <Link
                                href={doc.fileUrl}
                                target="_blank"
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
                              >
                                <ExternalLink className="h-4 w-4" />
                                Ouvrir la pièce
                              </Link>

                              {doc.status === "PENDING" && (
                                <div className="mt-4">
                                  <VerificationActions documentId={doc.id} />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}