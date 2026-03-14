import { NextResponse } from "next/server";

export async function POST() {
    try {
        const response = NextResponse.json(
            { message: "Déconnexion réussie." },
            { status: 200 }
        );

        response.cookies.set("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            expires: new Date(0),
        });

        return response;
    } catch (error) {
        console.error("LOGOUT ERROR:", error);

        return NextResponse.json(
            { error: "Erreur lors de la déconnexion." },
            { status: 500 }
        );
    }
}