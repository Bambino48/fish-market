import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
        }

        if (user.role !== "SELLER") {
            return NextResponse.json(
                { error: "Seuls les vendeurs peuvent envoyer des images." },
                { status: 403 }
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
        const fileName = `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}.${extension}`;

        const filePath = path.join(process.cwd(), "public/uploads", fileName);

        await writeFile(filePath, buffer);

        const imageUrl = `/uploads/${fileName}`;

        return NextResponse.json(
            {
                message: "Image uploadée avec succès.",
                imageUrl,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("UPLOAD ERROR:", error);
        return NextResponse.json(
            { error: "Erreur serveur lors de l'upload." },
            { status: 500 }
        );
    }
}