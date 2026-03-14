import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function POST(req: Request) {
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

        const body = await req.json();
        const {
            title,
            species,
            description,
            price,
            quantity,
            unit,
            imageUrl,
            location,
        } = body;

        if (!title || !species || !price || !quantity) {
            return NextResponse.json(
                { error: "Les champs obligatoires sont manquants." },
                { status: 400 }
            );
        }

        const fish = await prisma.fish.create({
            data: {
                title,
                species,
                description: description || null,
                price: Number(price),
                quantity: Number(quantity),
                unit: unit || "KG",
                imageUrl: imageUrl || null,
                location: location || user.city || "San Pedro",
                sellerId: user.id,
            },
        });

        return NextResponse.json(
            { message: "Poisson ajouté avec succès.", fish },
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