"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FishSymbol,
  ShoppingCart,
  MessageCircle,
  ArrowLeft,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";

const links = [
  {
    href: "/admin",
    label: "Vue générale",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/users",
    label: "Utilisateurs",
    icon: Users,
  },
  {
    href: "/admin/fishes",
    label: "Poissons",
    icon: FishSymbol,
  },
  {
    href: "/admin/orders",
    label: "Commandes",
    icon: ShoppingCart,
  },
  {
    href: "/admin/conversations",
    label: "Conversations",
    icon: MessageCircle,
  },
  {
    href: "/admin/verifications",
    label: "Vérifications",
    icon: BadgeCheck,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full self-stretch rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:w-72">
      <div className="flex h-full min-h-180 flex-col">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
            <ShieldCheck className="h-5 w-5" />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900">Admin Panel</p>
            <p className="text-xs text-slate-500">Fish Market</p>
          </div>
        </div>

        <nav className="mt-6 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${active
                    ? "bg-sky-50 text-sky-700"
                    : "text-slate-700 hover:bg-slate-100"
                  }`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-slate-200 pt-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour dashboard
          </Link>
        </div>
      </div>
    </aside>
  );
}