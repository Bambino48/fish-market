import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

const ALLOWED_STATUSES = ["CONFIRMED", "CANCELLED", "COMPLETED"] as const;
type AllowedStatus = (typeof ALLOWED_STATUSES)[number];

export async function PATCH(req: Request, { params }: RouteContext) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: "Vous devez être connecté pour modifier cette commande." },
                { status: 401 }
            );
        }

        if (user.role !== "SELLER") {
            return NextResponse.json(
                { error: "Seuls les vendeurs peuvent modifier le statut d'une commande." },
                { status: 403 }
            );
        }

        const { id } = await params;
        const orderId = Number(id);

        if (Number.isNaN(orderId) || orderId <= 0) {
            return NextResponse.json(
                { error: "Identifiant de commande invalide." },
                { status: 400 }
            );
        }

        const body = await req.json();
        const status = body?.status as string | undefined;

        if (!status || !ALLOWED_STATUSES.includes(status as AllowedStatus)) {
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

        if (status === "CONFIRMED" || status === "CANCELLED") {
            if (order.status !== "PENDING") {
                return NextResponse.json(
                    { error: "Cette commande a déjà été traitée." },
                    { status: 400 }
                );
            }
        }

        if (status === "COMPLETED") {
            if (order.status !== "CONFIRMED") {
                return NextResponse.json(
                    { error: "Seules les commandes confirmées peuvent être marquées comme terminées." },
                    { status: 400 }
                );
            }
        }

        const result = await prisma.$transaction(async (tx) => {
            const updatedOrder = await tx.order.update({
                where: { id: orderId },
                data: {
                    status: status as AllowedStatus,
                },
            });

            if (status === "CONFIRMED") {
                await tx.fish.update({
                    where: { id: order.fishId },
                    data: {
                        available: false,
                    },
                });
            }

            return updatedOrder;
        });

        return NextResponse.json(
            {
                message:
                    status === "CONFIRMED"
                        ? "Commande confirmée avec succès."
                        : status === "CANCELLED"
                            ? "Commande annulée avec succès."
                            : "Commande marquée comme terminée avec succès.",
                order: result,
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