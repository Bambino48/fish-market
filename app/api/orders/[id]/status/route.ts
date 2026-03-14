import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function PATCH(req: Request, { params }: RouteContext) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
        }

        if (user.role !== "SELLER") {
            return NextResponse.json(
                { error: "Seuls les vendeurs peuvent modifier le statut d'une commande." },
                { status: 403 }
            );
        }

        const { id } = await params;
        const orderId = Number(id);

        if (isNaN(orderId)) {
            return NextResponse.json(
                { error: "Identifiant de commande invalide." },
                { status: 400 }
            );
        }

        const body = await req.json();
        const { status } = body;

        const allowedStatuses = ["CONFIRMED", "CANCELLED"];

        if (!allowedStatuses.includes(status)) {
            return NextResponse.json(
                { error: "Statut non autorisé." },
                { status: 400 }
            );
        }

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                fish: true,
            },
        });

        if (!order) {
            return NextResponse.json(
                { error: "Commande introuvable." },
                { status: 404 }
            );
        }

        if (order.sellerId !== user.id) {
            return NextResponse.json(
                { error: "Vous ne pouvez pas modifier cette commande." },
                { status: 403 }
            );
        }

        if (order.status !== "PENDING") {
            return NextResponse.json(
                { error: "Cette commande a déjà été traitée." },
                { status: 400 }
            );
        }

        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: {
                status,
            },
        });

        return NextResponse.json(
            {
                message: "Statut de la commande mis à jour avec succès.",
                order: updatedOrder,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("UPDATE ORDER STATUS ERROR:", error);
        return NextResponse.json(
            { error: "Erreur serveur lors de la mise à jour du statut." },
            { status: 500 }
        );
    }
}