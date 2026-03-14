import Link from "next/link";
import { getCurrentUser } from "@/lib/getCurrentUser";
import LogoutButton from "./LogoutButton";
import { FishSymbol, LayoutDashboard, LogIn, UserPlus } from "lucide-react";

export default async function Header() {
    const user = await getCurrentUser();

    return (
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-sm">
                        <FishSymbol className="h-5 w-5" />
                    </div>

                    <div>
                        <p className="text-lg font-bold tracking-tight text-slate-900">
                            Fish Market
                        </p>
                        <p className="text-sm text-slate-500">
                            Plateforme de vente et d’achat de poissons
                        </p>
                    </div>
                </Link>

                <div className="flex items-center gap-3">
                    <nav className="hidden items-center gap-6 md:flex">
                        <Link
                            href="/"
                            className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
                        >
                            Accueil
                        </Link>

                        <Link
                            href="/fishes"
                            className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
                        >
                            Catalogue
                        </Link>

                        {user && (
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                Dashboard
                            </Link>
                        )}
                    </nav>

                    {user ? (
                        <div className="flex items-center gap-3">
                            <div className="hidden rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700 sm:block">
                                {user.name}
                            </div>
                            <LogoutButton />
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                <LogIn className="h-4 w-4" />
                                Connexion
                            </Link>

                            <Link
                                href="/register"
                                className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
                            >
                                <UserPlus className="h-4 w-4" />
                                Inscription
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}