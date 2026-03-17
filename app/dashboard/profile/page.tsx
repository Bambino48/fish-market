import { getCurrentUser } from "@/lib/getCurrentUser";
import { redirect } from "next/navigation";
import ProfileForm from "../../components/profile/ProfileForm";
import Link from "next/link";
import {
    BadgeCheck,
    ShieldCheck,
    UserRound,
    ArrowLeft,
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

export default async function ProfilePage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    const verificationLabel = getVerificationLabel(user.verificationStatus);
    const verificationBadgeClass = getVerificationBadgeClass(user.verificationStatus);

    return (
        <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-4xl">
                <div className="overflow-hidden rounded-4xl border border-slate-200 bg-linear-to-r from-slate-900 via-slate-800 to-sky-900 text-white shadow-lg">
                    <div className="flex flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-8 md:py-10">
                        <div className="max-w-3xl">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur">
                                <UserRound className="h-4 w-4" />
                                Espace profil
                            </div>

                            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                                Mon profil
                            </h1>

                            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                                Mettez à jour vos informations personnelles, votre photo de profil
                                et consultez l’état de votre compte.
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
                                <ShieldCheck className="h-5 w-5" />
                            </div>

                            <div>
                                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                                    État du compte
                                </h2>
                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                    Consultez ici les informations importantes sur votre profil et
                                    votre statut de vérification.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 space-y-4">
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Vérification
                                </p>

                                <div className="mt-3 space-y-3">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-sm text-slate-600">Compte vérifié</span>
                                        <span
                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${user.isVerified
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-slate-100 text-slate-700"
                                                }`}
                                        >
                                            {user.isVerified ? "Oui" : "Non"}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-sm text-slate-600">
                                            Statut de vérification
                                        </span>
                                        <span
                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${verificationBadgeClass}`}
                                        >
                                            {verificationLabel}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-dashed border-slate-300 p-4">
                                <p className="text-sm font-semibold text-slate-800">
                                    Conseil rapide
                                </p>
                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    Un profil complet avec photo, ville et coordonnées à jour
                                    inspire davantage confiance aux autres utilisateurs.
                                </p>
                            </div>

                            {user.role === "SELLER" && (
                                <Link
                                    href="/dashboard/verification"
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
                                >
                                    <BadgeCheck className="h-4 w-4" />
                                    Gérer ma vérification
                                </Link>
                            )}
                        </div>
                    </aside>

                    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                                Informations personnelles
                            </h2>
                            <p className="mt-1 text-sm leading-6 text-slate-600">
                                Modifiez vos informations visibles dans votre compte Fish Market.
                            </p>
                        </div>

                        <ProfileForm
                            currentName={user.name}
                            currentCity={user.city || ""}
                            currentProfileImageUrl={user.profileImageUrl || ""}
                            currentPhone={user.phone}
                            currentEmail={user.email || ""}
                            currentRole={user.role}
                        />
                    </section>
                </div>
            </div>
        </main>
    );
}