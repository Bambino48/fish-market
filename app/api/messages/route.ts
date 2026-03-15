import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: "Vous devez être connecté pour envoyer un message." },
                { status: 401 }
            );
        }

        const body = await req.json();

        const fishId = Number(body?.fishId);
        const content = body?.content?.trim();

        if (!body?.fishId || !content) {
            return NextResponse.json(
                { error: "Le poisson et le contenu du message sont obligatoires." },
                { status: 400 }
            );
        }

        if (Number.isNaN(fishId) || fishId <= 0) {
            return NextResponse.json(
                { error: "Identifiant de poisson invalide." },
                { status: 400 }
            );
        }

        const fish = await prisma.fish.findUnique({
            where: { id: fishId },
        });

        if (!fish) {
            return NextResponse.json(
                { error: "Poisson introuvable." },
                { status: 404 }
            );
        }

        if (user.role === "SELLER") {
            return NextResponse.json(
                { error: "Le vendeur doit répondre depuis une conversation existante." },
                { status: 400 }
            );
        }

        if (user.role !== "BUYER") {
            return NextResponse.json(
                { error: "Rôle non autorisé pour cette action." },
                { status: 403 }
            );
        }

        if (fish.sellerId === user.id) {
            return NextResponse.json(
                { error: "Vous ne pouvez pas vous envoyer un message à propos de votre propre annonce." },
                { status: 400 }
            );
        }

        const buyerId = user.id;
        const sellerId = fish.sellerId;

        const conversation = await prisma.conversation.upsert({
            where: {
                fishId_buyerId_sellerId: {
                    fishId: fish.id,
                    buyerId,
                    sellerId,
                },
            },
            update: {},
            create: {
                fishId: fish.id,
                buyerId,
                sellerId,
            },
        });

        const message = await prisma.message.create({
            data: {
                conversationId: conversation.id,
                senderId: user.id,
                content,
            },
        });

        return NextResponse.json(
            {
                message: "Message envoyé avec succès.",
                conversationId: conversation.id,
                data: message,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("SEND MESSAGE ERROR:", error);

        return NextResponse.json(
            { error: "Erreur serveur lors de l'envoi du message." },
            { status: 500 }
        );
    }
}