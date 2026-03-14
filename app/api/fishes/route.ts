import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: "Vous devez être connecté pour publier une annonce." },
                { status: 401 }
            );
        }

        if (user.role !== "SELLER") {
            return NextResponse.json(
                { error: "Accès réservé aux vendeurs." },
                { status: 403 }
            );
        }

        const body = await req.json();

        const title = body.title?.trim();
        const species = body.species?.trim();
        const description = body.description?.trim() || null;
        const price = Number(body.price);
        const quantity = Number(body.quantity);
        const unit = body.unit?.trim() || "KG";
        const imageUrl = body.imageUrl?.trim() || null;
        const location = body.location?.trim() || user.city || "San Pedro";

        if (!title || !species || !body.price || !body.quantity) {
            return NextResponse.json(
                { error: "Les champs titre, espèce, prix et quantité sont obligatoires." },
                { status: 400 }
            );
        }

        if (Number.isNaN(price) || price <= 0) {
            return NextResponse.json(
                { error: "Le prix doit être un nombre supérieur à 0." },
                { status: 400 }
            );
        }

        if (Number.isNaN(quantity) || quantity <= 0) {
            return NextResponse.json(
                { error: "La quantité doit être un nombre supérieur à 0." },
                { status: 400 }
            );
        }

        const allowedUnits = ["KG", "CARTON", "PIECE"];

        if (!allowedUnits.includes(unit)) {
            return NextResponse.json(
                { error: "L’unité sélectionnée est invalide." },
                { status: 400 }
            );
        }

        const fish = await prisma.fish.create({
            data: {
                title,
                species,
                description,
                price,
                quantity,
                unit,
                imageUrl,
                location,
                sellerId: user.id,
            },
        });

        return NextResponse.json(
            {
                message: "Poisson ajouté avec succès.",
                fish,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("CREATE FISH ERROR:", error);

        return NextResponse.json(
            { error: "Erreur serveur lors de l'ajout du poisson." },
            { status: 500 }
        );
    }
}