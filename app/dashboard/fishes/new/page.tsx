import { getCurrentUser } from "@/lib/getCurrentUser";
import { redirect } from "next/navigation";
import NewFishForm from "../../../components/fishes/NewFishForm";

export default async function NewFishPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    if (user.role !== "SELLER") {
        redirect("/dashboard");
    }

    return (
        <main className="max-w-2xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">Ajouter un poisson</h1>
            <NewFishForm />
        </main>
    );
}