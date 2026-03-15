import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function POST(req: Request, { params }: RouteContext) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: "Vous devez être connecté pour répondre à cette conversation." },
                { status: 401 }
            );
        }

        const { id } = await params;
        const conversationId = Number(id);

        if (Number.isNaN(conversationId) || conversationId <= 0) {
            return NextResponse.json(
                { error: "Identifiant de conversation invalide." },
                { status: 400 }
            );
        }

        const body = await req.json();
        const content = body?.content?.trim();

        if (!content) {
            return NextResponse.json(
                { error: "Le contenu du message est obligatoire." },
                { status: 400 }
            );
        }

        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
        });

        if (!conversation) {
            return NextResponse.json(
                { error: "Conversation introuvable." },
                { status: 404 }
            );
        }

        const isAllowed =
            conversation.buyerId === user.id || conversation.sellerId === user.id;

        if (!isAllowed) {
            return NextResponse.json(
                { error: "Accès interdit à cette conversation." },
                { status: 403 }
            );
        }

        const message = await prisma.message.create({
            data: {
                conversationId,
                senderId: user.id,
                content,
            },
        });

        return NextResponse.json(
            {
                message: "Réponse envoyée avec succès.",
                data: message,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("REPLY MESSAGE ERROR:", error);

        return NextResponse.json(
            { error: "Erreur serveur lors de l'envoi de la réponse." },
            { status: 500 }
        );
    }
}