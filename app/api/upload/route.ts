import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getCurrentUser } from "@/lib/getCurrentUser";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
const MIME_TO_EXTENSION: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
};

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: "Vous devez être connecté pour envoyer une image." },
                { status: 401 }
            );
        }

        if (user.role !== "SELLER") {
            return NextResponse.json(
                { error: "Seuls les vendeurs peuvent envoyer des images." },
                { status: 403 }
            );
        }

        const formData = await req.formData();
        const file = formData.get("file");

        if (!file || !(file instanceof File)) {
            return NextResponse.json(
                { error: "Aucun fichier valide n'a été reçu." },
                { status: 400 }
            );
        }

        if (!ALLOWED_TYPES.includes(file.type as (typeof ALLOWED_TYPES)[number])) {
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

        const extension = MIME_TO_EXTENSION[file.type] || "jpg";
        const safeBaseName = file.name
            .replace(/\.[^/.]+$/, "")
            .toLowerCase()
            .replace(/[^a-z0-9-_]/g, "-")
            .replace(/-+/g, "-")
            .slice(0, 40);

        const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
        const fileName = `${safeBaseName || "fish"}-${uniqueSuffix}.${extension}`;

        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        await mkdir(uploadsDir, { recursive: true });

        const filePath = path.join(uploadsDir, fileName);
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