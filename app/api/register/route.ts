import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, phone, email, password, role, city } = body;

        if (!name || !phone || !password || !role) {
            return NextResponse.json(
                { error: "Tous les champs obligatoires doivent être remplis." },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { phone },
                    ...(email ? [{ email }] : []),
                ],
            },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "Un utilisateur avec ce téléphone ou email existe déjà." },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                phone,
                email: email || null,
                password: hashedPassword,
                role,
                city: city || null,
            },
        });

        return NextResponse.json(
            {
                message: "Compte créé avec succès.",
                user: {
                    id: user.id,
                    name: user.name,
                    phone: user.phone,
                    role: user.role,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("REGISTER ERROR:", error);
        return NextResponse.json(
            { error: "Erreur serveur lors de l'inscription." },
            { status: 500 }
        );
    }
}