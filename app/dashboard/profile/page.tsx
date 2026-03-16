import { getCurrentUser } from "@/lib/getCurrentUser";
import { redirect } from "next/navigation";
import Link from "next/link";
import ProfileForm from "../../components/profile/ProfileForm";
import { ArrowLeft, Save, UserRound } from "lucide-react";

export default async function ProfilePage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-5xl">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-sm font-medium text-sky-700">
                            <UserRound className="h-4 w-4" />
                            Espace profil
                        </div>

                        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                            Mon profil
                        </h1>

                        <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
                            Modifiez vos informations personnelles et gardez votre compte à jour.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Retour dashboard
                        </Link>

                        <button
                            type="submit"
                            form="profile-form"
                            className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
                        >
                            <Save className="h-4 w-4" />
                            Mettre à jour le profil
                        </button>
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <ProfileForm
                        currentName={user.name}
                        currentCity={user.city || ""}
                        currentProfileImageUrl={user.profileImageUrl || ""}
                        currentPhone={user.phone || ""}
                        currentEmail={user.email || ""}
                        currentRole={user.role || ""}
                    />
                </div>
            </div>
        </main>
    );
}