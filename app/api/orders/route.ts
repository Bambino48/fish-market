import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
        }

        if (user.role !== "BUYER") {
            return NextResponse.json(
                { error: "Seuls les acheteurs peuvent passer une commande." },
                { status: 403 }
            );
        }

        const body = await req.json();
        const { fishId, quantity } = body;

        if (!fishId || !quantity) {
            return NextResponse.json(
                { error: "fishId et quantity sont obligatoires." },
                { status: 400 }
            );
        }

        const numericFishId = Number(fishId);
        const numericQuantity = Number(quantity);

        if (isNaN(numericFishId) || isNaN(numericQuantity) || numericQuantity <= 0) {
            return NextResponse.json(
                { error: "Données de commande invalides." },
                { status: 400 }
            );
        }

        const fish = await prisma.fish.findUnique({
            where: { id: numericFishId },
        });

        if (!fish) {
            return NextResponse.json(
                { error: "Poisson introuvable." },
                { status: 404 }
            );
        }

        if (!fish.available) {
            return NextResponse.json(
                { error: "Ce poisson n'est plus disponible." },
                { status: 400 }
            );
        }

        if (fish.sellerId === user.id) {
            return NextResponse.json(
                { error: "Vous ne pouvez pas commander votre propre poisson." },
                { status: 400 }
            );
        }

        const totalPrice = fish.price * numericQuantity;

        const order = await prisma.order.create({
            data: {
                buyerId: user.id,
                sellerId: fish.sellerId,
                fishId: fish.id,
                quantity: numericQuantity,
                totalPrice,
                status: "PENDING",
            },
        });

        return NextResponse.json(
            {
                message: "Commande créée avec succès.",
                order,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("CREATE ORDER ERROR:", error);
        return NextResponse.json(
            { error: "Erreur serveur lors de la création de la commande." },
            { status: 500 }
        );
    }
}