import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: "Vous devez être connecté pour passer une commande." },
                { status: 401 }
            );
        }

        if (user.role !== "BUYER") {
            return NextResponse.json(
                { error: "Seuls les acheteurs peuvent passer une commande." },
                { status: 403 }
            );
        }

        const body = await req.json();

        const numericFishId = Number(body?.fishId);
        const numericQuantity = Number(body?.quantity);

        if (!body?.fishId || !body?.quantity) {
            return NextResponse.json(
                { error: "Le poisson et la quantité sont obligatoires." },
                { status: 400 }
            );
        }

        if (
            Number.isNaN(numericFishId) ||
            numericFishId <= 0 ||
            Number.isNaN(numericQuantity) ||
            numericQuantity <= 0 ||
            !Number.isInteger(numericQuantity)
        ) {
            return NextResponse.json(
                { error: "Les données de commande sont invalides." },
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