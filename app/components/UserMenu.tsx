"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    ChevronDown,
    LayoutDashboard,
    Settings,
    UserRound,
} from "lucide-react";
import LogoutButton from "./LogoutButton";

type UserMenuProps = {
    user: {
        name: string;
        email?: string;
        role: string;
        profileImageUrl?: string;
    };
};

function getInitials(name?: string | null) {
    if (!name) return "FM";

    const parts = name.trim().split(" ").filter(Boolean);

    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }

    return (parts[0][0] + parts[1][0]).toUpperCase();
}

function getRoleLabel(role?: string) {
    switch (role) {
        case "SELLER":
            return "Vendeur";
        case "BUYER":
            return "Acheteur";
        case "ADMIN":
            return "Administrateur";
        default:
            return "Utilisateur";
    }
}

export default function UserMenu({ user }: UserMenuProps) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const initials = getInitials(user.name);
    const roleLabel = getRoleLabel(user.role);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (!containerRef.current) return;

            if (!containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }

        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-left transition hover:bg-slate-100"
                aria-haspopup="menu"
                aria-expanded={open}
            >
                <div className="relative h-9 w-9 overflow-hidden rounded-full bg-sky-100 ring-1 ring-slate-200">
                    {user.profileImageUrl ? (
                        <Image
                            src={user.profileImageUrl}
                            alt={user.name || "Photo de profil"}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs font-bold text-sky-700">
                            {initials}
                        </div>
                    )}
                </div>

                <div className="hidden min-w-0 sm:block">
                    <p className="max-w-32 truncate text-sm font-semibold text-slate-900">
                        {user.name}
                    </p>
                    <p className="text-xs text-slate-500">{roleLabel}</p>
                </div>

                <ChevronDown
                    className={`hidden h-4 w-4 text-slate-500 transition sm:block ${open ? "rotate-180" : ""
                        }`}
                />
            </button>

            {open && (
                <div
                    className="absolute right-0 top-full z-40 mt-3 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl"
                    role="menu"
                >
                    <div className="rounded-xl bg-slate-50 px-3 py-3">
                        <div className="flex items-center gap-3">
                            <div className="relative h-11 w-11 overflow-hidden rounded-full bg-sky-100 ring-1 ring-slate-200">
                                {user.profileImageUrl ? (
                                    <Image
                                        src={user.profileImageUrl}
                                        alt={user.name || "Photo de profil"}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-xs font-bold text-sky-700">
                                        {initials}
                                    </div>
                                )}
                            </div>

                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-slate-900">
                                    {user.name}
                                </p>
                                <p className="truncate text-xs text-slate-500">
                                    {user.email || roleLabel}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-2 space-y-1">
                        <Link
                            href="/dashboard"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            role="menuitem"
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                        </Link>

                        <Link
                            href="/dashboard/profile"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            role="menuitem"
                        >
                            <UserRound className="h-4 w-4" />
                            Mon profil
                        </Link>

                        <Link
                            href="/dashboard/profile"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            role="menuitem"
                        >
                            <Settings className="h-4 w-4" />
                            Paramètres du compte
                        </Link>
                    </div>

                    <div className="mt-2 border-t border-slate-200 pt-2">
                        <LogoutButton />
                    </div>
                </div>
            )}
        </div>
    );
}