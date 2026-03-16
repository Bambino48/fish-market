import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function PATCH(req: Request) {

    try {

        const user = await getCurrentUser();

        if (!user || !user.id) {
            return NextResponse.json(
                { error: "Utilisateur non authentifié." },
                { status: 401 }
            );
        }

        const body = await req.json();

        const name = body?.name?.trim();
        const city = body?.city?.trim();
        const profileImageUrl = body?.profileImageUrl;

        if (!name) {
            return NextResponse.json(
                { error: "Le nom est obligatoire." },
                { status: 400 }
            );
        }

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                name,
                city: city || null,
                ...(profileImageUrl && { profileImageUrl })
            }
        });

        return NextResponse.json(
            {
                message: "Profil mis à jour.",
                user: updatedUser
            },
            { status: 200 }
        );

    } catch (error) {

        console.error("UPDATE PROFILE ERROR:", error);

        return NextResponse.json(
            { error: "Erreur serveur lors de la mise à jour du profil." },
            { status: 500 }
        );
    }
}