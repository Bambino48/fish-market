import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function getCurrentUser() {
    const sessionUser = await getSessionUser();

    if (!sessionUser) {
        return null;
    }

    const user = await prisma.user.findUnique({
        where: { id: sessionUser.id },
    });

    return user;
}