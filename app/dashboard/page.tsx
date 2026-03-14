import { getCurrentUser } from "@/lib/getCurrentUser";
import { redirect } from "next/navigation";
import LogoutButton from "../components/LogoutButton";
import Link from "next/link";

export default async function DashboardPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <main className="p-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <LogoutButton />
            </div>

            <div className="mt-6 space-y-2">
                <p>
                    <strong>Nom :</strong> {user.name}
                </p>
                <p>
                    <strong>Téléphone :</strong> {user.phone}
                </p>
                <p>
                    <strong>Rôle :</strong> {user.role}
                </p>
                <p>
                    <strong>Ville :</strong> {user.city || "Non renseignée"}
                </p>
            </div>

            <div className="mt-8 rounded-xl border p-6">
                {user.role === "SELLER" && (
                    <div>
                        <h2 className="text-xl font-semibold">Espace vendeur</h2>
                        <p className="mt-2">Gérez vos annonces de poissons.</p>

                        <div className="mt-4 flex gap-4">
                            <Link
                                href="/dashboard/fishes"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                            >
                                Voir mes poissons
                            </Link>

                            <Link
                                href="/dashboard/fishes/new"
                                className="px-4 py-2 bg-green-600 text-white rounded-lg"
                            >
                                Ajouter un poisson
                            </Link>
                        </div>
                    </div>
                )}

                {user.role === "BUYER" && (
                    <div>
                        <h2 className="text-xl font-semibold">Espace acheteur</h2>
                        <p className="mt-2">Tu pourras bientôt consulter et commander du poisson.</p>
                    </div>
                )}

                {user.role === "ADMIN" && (
                    <div>
                        <h2 className="text-xl font-semibold">Espace administrateur</h2>
                        <p className="mt-2">Tu pourras bientôt gérer toute la plateforme.</p>
                    </div>
                )}
            </div>
        </main>
    );
}