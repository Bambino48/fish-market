import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: "Vous devez être connecté pour envoyer une photo de profil." },
                { status: 401 }
            );
        }

        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json(
                { error: "Aucun fichier reçu." },
                { status: 400 }
            );
        }

        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "Format non supporté. Utilisez JPG, PNG ou WEBP." },
                { status: 400 }
            );
        }

        const maxSize = 5 * 1024 * 1024;

        if (file.size > maxSize) {
            return NextResponse.json(
                { error: "Image trop volumineuse. Maximum 5 Mo." },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const extension = file.name.split(".").pop() || "jpg";
        const fileName = `profile-${user.id}-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}.${extension}`;

        const uploadDir = path.join(process.cwd(), "public/uploads/profiles");

        await mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, fileName);

        await writeFile(filePath, buffer);

        const imageUrl = `/uploads/profiles/${fileName}`;

        return NextResponse.json(
            {
                message: "Photo de profil uploadée avec succès.",
                imageUrl,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("PROFILE UPLOAD ERROR:", error);

        return NextResponse.json(
            { error: "Erreur serveur lors de l'upload de la photo de profil." },
            { status: 500 }
        );
    }
}