import {
    CheckCircle2,
    Clock3,
    XCircle,
    BadgeCheck,
} from "lucide-react";

type OrderStatusBadgeProps = {
    status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
};

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
    const config = {
        PENDING: {
            label: "En attente",
            className: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
            icon: Clock3,
        },
        CONFIRMED: {
            label: "Confirmée",
            className: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
            icon: CheckCircle2,
        },
        CANCELLED: {
            label: "Annulée",
            className: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200",
            icon: XCircle,
        },
        COMPLETED: {
            label: "Terminée",
            className: "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200",
            icon: BadgeCheck,
        },
    };

    const current = config[status];
    const Icon = current.icon;

    return (
        <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${current.className}`}
        >
            <Icon className="h-4 w-4" />
            {current.label}
        </span>
    );
}