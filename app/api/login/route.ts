import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { phone, password } = body;

        if (!phone || !password) {
            return NextResponse.json(
                { error: "Téléphone et mot de passe sont obligatoires." },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { phone },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Utilisateur introuvable." },
                { status: 404 }
            );
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return NextResponse.json(
                { error: "Mot de passe incorrect." },
                { status: 401 }
            );
        }

        const token = createToken({
            id: user.id,
            name: user.name,
            phone: user.phone,
            role: user.role,
        });

        const response = NextResponse.json(
            {
                message: "Connexion réussie.",
                user: {
                    id: user.id,
                    name: user.name,
                    role: user.role,
                },
            },
            { status: 200 }
        );

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;
    } catch (error) {
        console.error("LOGIN ERROR:", error);
        return NextResponse.json(
            { error: "Erreur serveur lors de la connexion." },
            { status: 500 }
        );
    }
}