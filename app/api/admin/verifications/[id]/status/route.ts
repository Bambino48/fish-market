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

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Accès interdit." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const documentId = Number(id);

    if (Number.isNaN(documentId) || documentId <= 0) {
      return NextResponse.json(
        { error: "Identifiant invalide." },
        { status: 400 }
      );
    }

    const body = await req.json();

    const status = body?.status;
    const note =
      typeof body?.note === "string" ? body.note.trim() : "";

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { error: "Statut invalide." },
        { status: 400 }
      );
    }

    if (status === "REJECTED" && !note) {
      return NextResponse.json(
        { error: "Une note admin est obligatoire pour rejeter un document." },
        { status: 400 }
      );
    }

    const document = await prisma.verificationDocument.findUnique({
      where: { id: documentId },
      select: {
        id: true,
        userId: true,
        status: true,
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document introuvable." },
        { status: 404 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.verificationDocument.update({
        where: { id: documentId },
        data: {
          status,
          note: note || null,
        },
      });

      await tx.user.update({
        where: { id: document.userId },
        data: {
          verificationStatus: status,
          isVerified: status === "APPROVED",
        },
      });
    });

    return NextResponse.json(
      {
        message:
          status === "APPROVED"
            ? "Vérification approuvée avec succès."
            : "Vérification rejetée avec succès.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("ADMIN VERIFICATION UPDATE ERROR:", error);

    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}