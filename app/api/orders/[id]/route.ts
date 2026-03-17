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

        if (user.role !== "BUYER") {
            return NextResponse.json(
                { error: "Seuls les acheteurs peuvent modifier une commande." },
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
        const quantity = Number(body?.quantity);

        if (Number.isNaN(quantity) || quantity <= 0 || !Number.isInteger(quantity)) {
            return NextResponse.json(
                { error: "La quantité doit être un entier supérieur à 0." },
                { status: 400 }
            );
        }

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { fish: true },
        });

        if (!order) {
            return NextResponse.json(
                { error: "Commande introuvable." },
                { status: 404 }
            );
        }

        if (order.buyerId !== user.id) {
            return NextResponse.json(
                { error: "Vous ne pouvez pas modifier cette commande." },
                { status: 403 }
            );
        }

        if (order.status !== "PENDING") {
            return NextResponse.json(
                { error: "Seules les commandes en attente peuvent être modifiées." },
                { status: 400 }
            );
        }

        const totalPrice = order.fish.price * quantity;

        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: {
                quantity,
                totalPrice,
            },
        });

        return NextResponse.json(
            {
                message: "Commande mise à jour avec succès.",
                order: updatedOrder,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("UPDATE ORDER ERROR:", error);
        return NextResponse.json(
            { error: "Erreur serveur lors de la modification de la commande." },
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

        if (user.role !== "BUYER") {
            return NextResponse.json(
                { error: "Seuls les acheteurs peuvent supprimer une commande." },
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

        const order = await prisma.order.findUnique({
            where: { id: orderId },
        });

        if (!order) {
            return NextResponse.json(
                { error: "Commande introuvable." },
                { status: 404 }
            );
        }

        if (order.buyerId !== user.id) {
            return NextResponse.json(
                { error: "Vous ne pouvez pas supprimer cette commande." },
                { status: 403 }
            );
        }

        if (order.status !== "PENDING") {
            return NextResponse.json(
                { error: "Seules les commandes en attente peuvent être supprimées." },
                { status: 400 }
            );
        }

        await prisma.order.delete({
            where: { id: orderId },
        });

        return NextResponse.json(
            { message: "Commande supprimée avec succès." },
            { status: 200 }
        );
    } catch (error) {
        console.error("DELETE ORDER ERROR:", error);
        return NextResponse.json(
            { error: "Erreur serveur lors de la suppression de la commande." },
            { status: 500 }
        );
    }
}