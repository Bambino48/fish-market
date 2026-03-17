import { getCurrentUser } from "@/lib/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import VerificationForm from "../profile/VerificationForm";
import {
  ArrowLeft,
  BadgeCheck,
  FileCheck2,
  ShieldCheck,
} from "lucide-react";

function getVerificationLabel(status: string) {
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

function getVerificationBadgeClass(status: string) {
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

function getDocumentTypeLabel(type: string) {
  switch (type) {
    case "PERMIS":
      return "Permis de pêche";
    case "ID_CARD":
      return "Pièce d’identité";
    default:
      return type;
  }
}

export default async function VerificationPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "SELLER") {
    redirect("/dashboard");
  }

  const documents = await prisma.verificationDocument.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const verificationLabel = getVerificationLabel(user.verificationStatus);
  const verificationBadgeClass = getVerificationBadgeClass(user.verificationStatus);

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-4xl border border-slate-200 bg-linear-to-r from-slate-900 via-slate-800 to-sky-900 text-white shadow-lg">
          <div className="flex flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-8 md:py-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur">
                <ShieldCheck className="h-4 w-4" />
                Vérification vendeur
              </div>

              <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Vérification du compte vendeur
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                Ajoutez une capture de votre permis de pêche pour faire certifier
                votre compte et renforcer la confiance des acheteurs.
              </p>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour dashboard
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                <BadgeCheck className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                  Statut du compte
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Consultez ici l’état actuel de votre vérification vendeur.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Compte vérifié
                </p>
                <div className="mt-3">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      user.isVerified
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {user.isVerified ? "Oui" : "Non"}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Statut de vérification
                </p>
                <div className="mt-3">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${verificationBadgeClass}`}
                  >
                    {verificationLabel}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-dashed border-slate-300 p-4">
                <p className="text-sm font-semibold text-slate-800">
                  Bon à savoir
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Une vérification approuvée peut améliorer la crédibilité de votre
                  profil vendeur auprès des acheteurs sur la plateforme.
                </p>
              </div>
            </div>
          </aside>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Soumettre une pièce
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Ajoutez votre document pour lancer ou mettre à jour votre demande
                de vérification.
              </p>
            </div>

            <VerificationForm />
          </section>
        </div>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <FileCheck2 className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Pièces soumises
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Consultez l’historique de vos documents envoyés pour vérification.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {documents.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                <p className="text-sm text-slate-600">
                  Aucune pièce soumise pour le moment.
                </p>
              </div>
            ) : (
              documents.map((doc) => {
                const docStatusLabel = getVerificationLabel(doc.status);
                const docStatusClass = getVerificationBadgeClass(doc.status);

                return (
                  <div
                    key={doc.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Type de document
                          </p>
                          <p className="mt-1 text-base font-semibold text-slate-900">
                            {getDocumentTypeLabel(doc.fileType)}
                          </p>
                        </div>

                        {doc.note && (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Note admin
                            </p>
                            <p className="mt-1 text-sm leading-6 text-slate-700">
                              {doc.note}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-start gap-3 sm:items-end">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${docStatusClass}`}
                        >
                          {docStatusLabel}
                        </span>

                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
                        >
                          Voir la pièce
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </main>
  );
}