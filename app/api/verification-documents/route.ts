import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Non autorisé." },
        { status: 401 }
      );
    }

    if (user.role !== "SELLER") {
      return NextResponse.json(
        { error: "Seuls les vendeurs peuvent soumettre un permis." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const fileUrl =
      typeof body?.fileUrl === "string" ? body.fileUrl.trim() : "";

    if (!fileUrl) {
      return NextResponse.json(
        { error: "Le document est obligatoire." },
        { status: 400 }
      );
    }

    const existingPending = await prisma.verificationDocument.findFirst({
      where: {
        userId: user.id,
        status: "PENDING",
      },
      select: {
        id: true,
      },
    });

    if (existingPending) {
      return NextResponse.json(
        { error: "Une demande de vérification est déjà en attente." },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const document = await tx.verificationDocument.create({
        data: {
          userId: user.id,
          fileUrl,
          fileType: "PERMIS_DE_PECHE",
          status: "PENDING",
        },
      });

      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          verificationStatus: "PENDING",
          isVerified: false,
        },
      });

      return { document, updatedUser };
    });

    return NextResponse.json(
      {
        message: "Permis soumis avec succès.",
        document: result.document,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("VERIFICATION SUBMIT ERROR:", error);

    return NextResponse.json(
      { error: "Erreur serveur lors de la soumission." },
      { status: 500 }
    );
  }
}