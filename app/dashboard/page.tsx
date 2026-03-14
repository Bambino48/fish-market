import { getCurrentUser } from "@/lib/getCurrentUser";
import { redirect } from "next/navigation";
import LogoutButton from "../components/LogoutButton";

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
        </main>
    );
}