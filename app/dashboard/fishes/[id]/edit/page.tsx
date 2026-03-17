import { getCurrentUser } from "@/lib/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, PencilLine, Store } from "lucide-react";
import EditFishForm from "../../../../components/fishes/EditFishForm";

type EditFishPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function EditFishPage({ params }: EditFishPageProps) {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    if (user.role !== "SELLER") {
        redirect("/dashboard");
    }

    const { id } = await params;
    const fishId = Number(id);

    if (Number.isNaN(fishId) || fishId <= 0) {
        notFound();
    }

    const fish = await prisma.fish.findUnique({
        where: { id: fishId },
    });

    if (!fish || fish.sellerId !== user.id) {
        notFound();
    }

    return (
        <main className="bg-slate-50">
            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                <div className="overflow-hidden rounded-4xl border border-slate-200 bg-linear-to-r from-slate-900 via-slate-800 to-sky-900 text-white shadow-lg">
                    <div className="flex flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-8 md:py-10">
                        <div className="max-w-3xl">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur">
                                <PencilLine className="h-4 w-4" />
                                Espace vendeur
                            </div>

                            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                                Modifier un poisson
                            </h1>

                            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                                Ajustez les informations de votre annonce tout en gardant votre présentation claire et professionnelle.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="/dashboard/fishes"
                                className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Mes poissons
                            </Link>

                            <Link
                                href="/dashboard"
                                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                            >
                                <Store className="h-4 w-4" />
                                Dashboard
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-6 rounded-4xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                            Formulaire de modification
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            Mettez à jour votre annonce sans casser sa logique actuelle.
                        </p>
                    </div>

                    <EditFishForm
                        fish={{
                            id: fish.id,
                            title: fish.title,
                            species: fish.species,
                            description: fish.description,
                            price: fish.price,
                            quantity: fish.quantity,
                            unit: fish.unit,
                            imageUrl: fish.imageUrl,
                            location: fish.location,
                            available: fish.available,
                        }}
                    />
                </div>
            </section>
        </main>
    );
}