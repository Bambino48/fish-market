import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function getCurrentUser() {

    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.id) {
        return null;
    }

    const user = await prisma.user.findUnique({
        where: { id: sessionUser.id },
        select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            role: true,
            city: true,
            profileImageUrl: true,
        }
    });

    return user;
}