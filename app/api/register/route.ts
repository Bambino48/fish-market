import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

const ALLOWED_ROLES = ["BUYER", "SELLER"] as const;
type AllowedRole = (typeof ALLOWED_ROLES)[number];

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const name = body.name?.trim();
        const phone = body.phone?.trim();
        const email = body.email?.trim() || null;
        const password = body.password;
        const role = body.role as string | undefined;
        const city = body.city?.trim() || null;

        if (!name || !phone || !password || !role) {
            return NextResponse.json(
                { error: "Le nom, le téléphone, le mot de passe et le rôle sont obligatoires." },
                { status: 400 }
            );
        }

        if (!ALLOWED_ROLES.includes(role as AllowedRole)) {
            return NextResponse.json(
                { error: "Le rôle sélectionné est invalide." },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: "Le mot de passe doit contenir au moins 6 caractères." },
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
                { error: "Un utilisateur avec ce téléphone ou cet email existe déjà." },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                phone,
                email,
                password: hashedPassword,
                role: role as AllowedRole,
                city,
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