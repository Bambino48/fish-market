import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key_change_me";

export type SessionUser = {
    id: number;
    name: string;
    phone: string;
    role: "BUYER" | "SELLER" | "ADMIN";
};

export function createToken(user: SessionUser) {
    return jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): SessionUser | null {
    try {
        return jwt.verify(token, JWT_SECRET) as SessionUser;
    } catch {
        return null;
    }
}

export async function getSessionUser(): Promise<SessionUser | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return null;
    }

    return verifyToken(token);
}