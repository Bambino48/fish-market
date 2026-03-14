import { getCurrentUser } from "@/lib/getCurrentUser";
import { redirect } from "next/navigation";
import LogoutButton from "../components/LogoutButton";
import Link from "next/link";
import {
    BadgeCheck,
    ClipboardList,
    FishSymbol,
    MapPin,
    Phone,
    Plus,
    ScanSearch,
    ShieldCheck,
    Store,
    UserRound,
} from "lucide-react";

function getInitials(name?: string | null) {
    if (!name) return "FM";

    const parts = name.trim().split(" ").filter(Boolean);

    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }

    return (parts[0][0] + parts[1][0]).toUpperCase();
}

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

function getRoleDescription(role: string) {
    switch (role) {
        case "SELLER":
            return "Gérez vos annonces, suivez vos ventes et développez votre activité sur Fish Market.";
        case "BUYER":
            return "Consultez le catalogue, passez vos commandes et retrouvez facilement vos achats.";
        case "ADMIN":
            return "Supervisez la plateforme, les utilisateurs et les opérations principales.";
        default:
            return "Bienvenue sur votre espace personnel.";
    }
}

export default async function DashboardPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    const initials = getInitials(user.name);
    const roleLabel = getRoleLabel(user.role);
    const roleDescription = getRoleDescription(user.role);

    return (
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-linear-to-r from-sky-700 via-cyan-700 to-emerald-600 text-white shadow-sm">
                <div className="grid gap-6 px-6 py-8 md:grid-cols-[1.5fr_0.9fr] md:px-8 md:py-10">
                    <div>
                        <div className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-sm font-medium backdrop-blur">
                            Bienvenue sur votre espace Fish Market
                        </div>

                        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                            Bonjour, {user.name}
                        </h1>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/90 sm:text-base">
                            {roleDescription}
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3">
                            {user.role === "SELLER" && (
                                <>
                                    <Link
                                        href="/dashboard/fishes/new"
                                        className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-sky-700 transition hover:bg-slate-100"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Ajouter un poisson
                                    </Link>

                                    <Link
                                        href="/dashboard/fishes"
                                        className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                                    >
                                        <FishSymbol className="h-4 w-4" />
                                        Voir mes annonces
                                    </Link>
                                </>
                            )}

                            {user.role === "BUYER" && (
                                <>
                                    <Link
                                        href="/fishes"
                                        className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-sky-700 transition hover:bg-slate-100"
                                    >
                                        <ScanSearch className="h-4 w-4" />
                                        Voir le catalogue
                                    </Link>

                                    <Link
                                        href="/dashboard/orders"
                                        className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                                    >
                                        <ClipboardList className="h-4 w-4" />
                                        Mes commandes
                                    </Link>
                                </>
                            )}

                            {user.role === "ADMIN" && (
                                <div className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white">
                                    <ShieldCheck className="h-4 w-4" />
                                    Panneau d’administration en préparation
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-lg font-bold text-sky-700 shadow-sm">
                                {initials}
                            </div>

                            <div>
                                <p className="text-lg font-semibold">{user.name}</p>
                                <p className="text-sm text-white/85">{roleLabel}</p>
                            </div>
                        </div>

                        <div className="mt-5 space-y-3 text-sm">
                            <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/10 px-4 py-3">
                                <span className="inline-flex items-center gap-2 text-white/80">
                                    <Phone className="h-4 w-4" />
                                    Téléphone
                                </span>
                                <span className="font-medium text-white">{user.phone}</span>
                            </div>

                            <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/10 px-4 py-3">
                                <span className="inline-flex items-center gap-2 text-white/80">
                                    <MapPin className="h-4 w-4" />
                                    Ville
                                </span>
                                <span className="font-medium text-white">
                                    {user.city || "Non renseignée"}
                                </span>
                            </div>

                            <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/10 px-4 py-3">
                                <span className="inline-flex items-center gap-2 text-white/80">
                                    <BadgeCheck className="h-4 w-4" />
                                    Statut
                                </span>
                                <span className="font-medium text-white">Compte actif</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.35fr]">
                <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-100 text-xl font-bold text-sky-700">
                            {initials}
                        </div>

                        <div>
                            <h2 className="text-xl font-bold">{user.name}</h2>
                            <p className="text-sm text-slate-500">{roleLabel}</p>
                        </div>
                    </div>

                    <div className="mt-6 space-y-4">
                        <div className="rounded-2xl bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Profil
                            </p>

                            <div className="mt-3 space-y-3 text-sm">
                                <p className="inline-flex items-center gap-2 text-slate-600">
                                    <UserRound className="h-4 w-4 text-slate-500" />
                                    <span>
                                        <span className="font-semibold text-slate-700">Nom :</span> {user.name}
                                    </span>
                                </p>

                                <p className="inline-flex items-center gap-2 text-slate-600">
                                    <Phone className="h-4 w-4 text-slate-500" />
                                    <span>
                                        <span className="font-semibold text-slate-700">Téléphone :</span> {user.phone}
                                    </span>
                                </p>

                                <p className="inline-flex items-center gap-2 text-slate-600">
                                    <Store className="h-4 w-4 text-slate-500" />
                                    <span>
                                        <span className="font-semibold text-slate-700">Rôle :</span> {roleLabel}
                                    </span>
                                </p>

                                <p className="inline-flex items-center gap-2 text-slate-600">
                                    <MapPin className="h-4 w-4 text-slate-500" />
                                    <span>
                                        <span className="font-semibold text-slate-700">Ville :</span>{" "}
                                        {user.city || "Non renseignée"}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-dashed border-slate-300 p-4">
                            <p className="text-sm font-semibold text-slate-800">
                                Conseil rapide
                            </p>
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                Gardez vos informations à jour pour renforcer la confiance sur la
                                plateforme et faciliter les échanges.
                            </p>
                        </div>

                        <div className="md:hidden">
                            <LogoutButton fullWidth />
                        </div>
                    </div>
                </aside>

                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    {user.role === "SELLER" && (
                        <div>
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold tracking-tight">
                                        Espace vendeur
                                    </h2>
                                    <p className="mt-1 text-slate-600">
                                        Gérez vos annonces de poissons et suivez vos activités.
                                    </p>
                                </div>

                                <span className="inline-flex w-fit rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                                    Compte vendeur actif
                                </span>
                            </div>

                            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                <Link
                                    href="/dashboard/fishes"
                                    className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                                        <FishSymbol className="h-5 w-5" />
                                    </div>
                                    <h3 className="mt-4 text-lg font-semibold text-slate-900">
                                        Voir mes poissons
                                    </h3>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">
                                        Consultez toutes vos annonces publiées et gérez-les facilement.
                                    </p>
                                    <p className="mt-4 text-sm font-semibold text-sky-700">
                                        Ouvrir →
                                    </p>
                                </Link>

                                <Link
                                    href="/dashboard/fishes/new"
                                    className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                                        <Plus className="h-5 w-5" />
                                    </div>
                                    <h3 className="mt-4 text-lg font-semibold text-slate-900">
                                        Ajouter un poisson
                                    </h3>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">
                                        Publiez une nouvelle annonce pour présenter vos produits.
                                    </p>
                                    <p className="mt-4 text-sm font-semibold text-emerald-700">
                                        Ajouter →
                                    </p>
                                </Link>

                                <Link
                                    href="/dashboard/sales"
                                    className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:border-orange-300 hover:bg-orange-50 sm:col-span-2 xl:col-span-1"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                                        <ClipboardList className="h-5 w-5" />
                                    </div>
                                    <h3 className="mt-4 text-lg font-semibold text-slate-900">
                                        Commandes reçues
                                    </h3>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">
                                        Suivez les commandes de vos clients et organisez vos ventes.
                                    </p>
                                    <p className="mt-4 text-sm font-semibold text-orange-700">
                                        Consulter →
                                    </p>
                                </Link>
                            </div>

                            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                <h3 className="text-base font-semibold text-slate-900">
                                    Recommandations vendeur
                                </h3>
                                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                                    <li>• Ajoutez des annonces claires avec des informations complètes.</li>
                                    <li>• Vérifiez régulièrement vos commandes reçues.</li>
                                    <li>• Gardez vos disponibilités à jour pour une meilleure confiance.</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {user.role === "BUYER" && (
                        <div>
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold tracking-tight">
                                        Espace acheteur
                                    </h2>
                                    <p className="mt-1 text-slate-600">
                                        Explorez le catalogue et suivez vos commandes en toute simplicité.
                                    </p>
                                </div>

                                <span className="inline-flex w-fit rounded-full bg-sky-100 px-3 py-1 text-sm font-medium text-sky-700">
                                    Compte acheteur actif
                                </span>
                            </div>

                            <div className="mt-6 grid gap-4 md:grid-cols-2">
                                <Link
                                    href="/fishes"
                                    className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                                        <ScanSearch className="h-5 w-5" />
                                    </div>
                                    <h3 className="mt-4 text-lg font-semibold text-slate-900">
                                        Voir le catalogue
                                    </h3>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">
                                        Découvrez les poissons disponibles et trouvez rapidement ce qu’il vous faut.
                                    </p>
                                    <p className="mt-4 text-sm font-semibold text-sky-700">
                                        Parcourir →
                                    </p>
                                </Link>

                                <Link
                                    href="/dashboard/orders"
                                    className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                                        <ClipboardList className="h-5 w-5" />
                                    </div>
                                    <h3 className="mt-4 text-lg font-semibold text-slate-900">
                                        Mes commandes
                                    </h3>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">
                                        Consultez l’historique et le suivi de vos commandes passées.
                                    </p>
                                    <p className="mt-4 text-sm font-semibold text-emerald-700">
                                        Consulter →
                                    </p>
                                </Link>
                            </div>

                            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                <h3 className="text-base font-semibold text-slate-900">
                                    Conseils d’achat
                                </h3>
                                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                                    <li>• Comparez les offres avant de commander.</li>
                                    <li>• Vérifiez la localisation du vendeur.</li>
                                    <li>• Suivez vos commandes depuis votre espace personnel.</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {user.role === "ADMIN" && (
                        <div>
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold tracking-tight">
                                        Espace administrateur
                                    </h2>
                                    <p className="mt-1 text-slate-600">
                                        Cet espace pourra bientôt centraliser la gestion complète de la plateforme.
                                    </p>
                                </div>

                                <span className="inline-flex w-fit rounded-full bg-violet-100 px-3 py-1 text-sm font-medium text-violet-700">
                                    Administration
                                </span>
                            </div>

                            <div className="mt-6 grid gap-4 md:grid-cols-3">
                                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                                        <UserRound className="h-5 w-5" />
                                    </div>
                                    <h3 className="mt-4 text-lg font-semibold">Utilisateurs</h3>
                                    <p className="mt-2 text-sm text-slate-600">
                                        Gestion des comptes vendeurs et acheteurs à venir.
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                                        <FishSymbol className="h-5 w-5" />
                                    </div>
                                    <h3 className="mt-4 text-lg font-semibold">Annonces</h3>
                                    <p className="mt-2 text-sm text-slate-600">
                                        Supervision des annonces publiées sur la plateforme.
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                                        <ClipboardList className="h-5 w-5" />
                                    </div>
                                    <h3 className="mt-4 text-lg font-semibold">Commandes</h3>
                                    <p className="mt-2 text-sm text-slate-600">
                                        Suivi global des transactions et des opérations.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </section>
        </main>
    );
}