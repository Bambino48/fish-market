import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

const ALLOWED_UNITS = ["KG", "CARTON", "PIECE"] as const;

export async function PATCH(req: Request, { params }: RouteContext) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
        }

        if (user.role !== "SELLER") {
            return NextResponse.json(
                { error: "Accès réservé aux vendeurs." },
                { status: 403 }
            );
        }

        const { id } = await params;
        const fishId = Number(id);

        if (Number.isNaN(fishId) || fishId <= 0) {
            return NextResponse.json(
                { error: "Identifiant de poisson invalide." },
                { status: 400 }
            );
        }

        const existingFish = await prisma.fish.findUnique({
            where: { id: fishId },
        });

        if (!existingFish) {
            return NextResponse.json(
                { error: "Poisson introuvable." },
                { status: 404 }
            );
        }

        if (existingFish.sellerId !== user.id) {
            return NextResponse.json(
                { error: "Vous ne pouvez pas modifier cette annonce." },
                { status: 403 }
            );
        }

        const body = await req.json();

        const title = body?.title?.trim();
        const species = body?.species?.trim();
        const description = body?.description?.trim() || null;
        const price = Number(body?.price);
        const quantity = Number(body?.quantity);
        const unit = body?.unit?.trim();
        const imageUrl = body?.imageUrl?.trim() || null;
        const location = body?.location?.trim() || null;
        const available =
            typeof body?.available === "boolean" ? body.available : existingFish.available;

        if (!title || !species) {
            return NextResponse.json(
                { error: "Le titre et l’espèce sont obligatoires." },
                { status: 400 }
            );
        }

        if (Number.isNaN(price) || price <= 0) {
            return NextResponse.json(
                { error: "Le prix doit être supérieur à 0." },
                { status: 400 }
            );
        }

        if (Number.isNaN(quantity) || quantity <= 0) {
            return NextResponse.json(
                { error: "La quantité doit être supérieure à 0." },
                { status: 400 }
            );
        }

        if (!unit || !ALLOWED_UNITS.includes(unit as (typeof ALLOWED_UNITS)[number])) {
            return NextResponse.json(
                { error: "L’unité sélectionnée est invalide." },
                { status: 400 }
            );
        }

        const updatedFish = await prisma.fish.update({
            where: { id: fishId },
            data: {
                title,
                species,
                description,
                price,
                quantity,
                unit,
                imageUrl,
                location,
                available,
            },
        });

        return NextResponse.json(
            {
                message: "Annonce mise à jour avec succès.",
                fish: updatedFish,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("UPDATE FISH ERROR:", error);
        return NextResponse.json(
            { error: "Erreur serveur lors de la mise à jour du poisson." },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request, { params }: RouteContext) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
        }

        if (user.role !== "SELLER") {
            return NextResponse.json(
                { error: "Accès réservé aux vendeurs." },
                { status: 403 }
            );
        }

        const { id } = await params;
        const fishId = Number(id);

        if (Number.isNaN(fishId) || fishId <= 0) {
            return NextResponse.json(
                { error: "Identifiant de poisson invalide." },
                { status: 400 }
            );
        }

        const existingFish = await prisma.fish.findUnique({
            where: { id: fishId },
            include: {
                orders: true,
            },
        });

        if (!existingFish) {
            return NextResponse.json(
                { error: "Poisson introuvable." },
                { status: 404 }
            );
        }

        if (existingFish.sellerId !== user.id) {
            return NextResponse.json(
                { error: "Vous ne pouvez pas supprimer cette annonce." },
                { status: 403 }
            );
        }

        const hasActiveOrders = existingFish.orders.some(
            (order) => order.status === "PENDING" || order.status === "CONFIRMED"
        );

        if (hasActiveOrders) {
            return NextResponse.json(
                { error: "Impossible de supprimer une annonce liée à des commandes actives." },
                { status: 400 }
            );
        }

        await prisma.fish.delete({
            where: { id: fishId },
        });

        return NextResponse.json(
            { message: "Annonce supprimée avec succès." },
            { status: 200 }
        );
    } catch (error) {
        console.error("DELETE FISH ERROR:", error);
        return NextResponse.json(
            { error: "Erreur serveur lors de la suppression du poisson." },
            { status: 500 }
        );
    }
}