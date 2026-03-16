import { getCurrentUser } from "@/lib/getCurrentUser";
import { redirect } from "next/navigation";
import LogoutButton from "../components/LogoutButton";
import Link from "next/link";
import Image from "next/image";
import {
  BadgeCheck,
  ClipboardList,
  FishSymbol,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  ScanSearch,
  ShieldCheck,
  Store,
  UserRound,
  LucideIcon,
} from "lucide-react";

function getInitials(name?: string | null) {
  if (!name) return "FM";

  const parts = name.trim().split(" ").filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function getRoleLabel(role: string) {
  switch (role) {
    case "SELLER":
      return "Vendeur";
    case "BUYER":
      return "Acheteur";
    case "ADMIN":
      return "Administrateur";
    default:
      return role;
  }
}

function getRoleDescription(role: string) {
  switch (role) {
    case "SELLER":
      return "Gérez vos annonces, suivez vos ventes, échangez avec les acheteurs et développez votre activité sur Fish Market.";
    case "BUYER":
      return "Consultez le catalogue, passez vos commandes, échangez avec les vendeurs et retrouvez facilement vos achats.";
    case "ADMIN":
      return "Supervisez la plateforme, les utilisateurs, les annonces, les commandes et l’activité globale.";
    default:
      return "Bienvenue sur votre espace personnel.";
  }
}

type HeroAction = {
  href: string;
  label: string;
  icon: LucideIcon;
  primary?: boolean;
};

type RoleCardAction = {
  href?: string;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  border: string;
  cta: string;
  colSpan?: string;
};

type RoleContent = {
  title: string;
  description: string;
  badge: string;
  badgeClassName: string;
  heroActions: HeroAction[];
  cards: RoleCardAction[];
  recommendationsTitle: string;
  recommendations: string[];
};

function getRoleContent(role: string): RoleContent {
  switch (role) {
    case "SELLER":
      return {
        title: "Espace vendeur",
        description:
          "Gérez vos annonces, suivez vos commandes et échangez avec vos acheteurs.",
        badge: "Compte vendeur actif",
        badgeClassName: "bg-emerald-100 text-emerald-700",
        heroActions: [
          {
            href: "/dashboard/fishes/new",
            label: "Ajouter un poisson",
            icon: Plus,
            primary: true,
          },
          {
            href: "/dashboard/fishes",
            label: "Voir mes annonces",
            icon: FishSymbol,
          },
          {
            href: "/dashboard/messages",
            label: "Messages",
            icon: MessageCircle,
          },
        ],
        cards: [
          {
            href: "/dashboard/fishes",
            label: "Voir mes poissons",
            description:
              "Consultez toutes vos annonces publiées et gérez-les facilement.",
            icon: FishSymbol,
            color: "text-sky-700",
            bg: "bg-sky-100",
            border: "hover:border-sky-300 hover:bg-sky-50",
            cta: "Ouvrir →",
          },
          {
            href: "/dashboard/fishes/new",
            label: "Ajouter un poisson",
            description:
              "Publiez une nouvelle annonce pour présenter vos produits.",
            icon: Plus,
            color: "text-emerald-700",
            bg: "bg-emerald-100",
            border: "hover:border-emerald-300 hover:bg-emerald-50",
            cta: "Ajouter →",
          },
          {
            href: "/dashboard/sales",
            label: "Commandes reçues",
            description:
              "Suivez les commandes de vos clients et organisez vos ventes.",
            icon: ClipboardList,
            color: "text-orange-700",
            bg: "bg-orange-100",
            border: "hover:border-orange-300 hover:bg-orange-50",
            cta: "Consulter →",
          },
          {
            href: "/dashboard/messages",
            label: "Messages",
            description:
              "Répondez aux acheteurs et suivez vos conversations.",
            icon: MessageCircle,
            color: "text-violet-700",
            bg: "bg-violet-100",
            border: "hover:border-violet-300 hover:bg-violet-50",
            cta: "Ouvrir →",
          },
        ],
        recommendationsTitle: "Recommandations vendeur",
        recommendations: [
          "Ajoutez des annonces claires avec des informations complètes.",
          "Vérifiez régulièrement vos commandes reçues.",
          "Répondez rapidement aux messages des acheteurs.",
        ],
      };

    case "BUYER":
      return {
        title: "Espace acheteur",
        description:
          "Explorez le catalogue, suivez vos commandes et échangez avec les vendeurs.",
        badge: "Compte acheteur actif",
        badgeClassName: "bg-sky-100 text-sky-700",
        heroActions: [
          {
            href: "/fishes",
            label: "Voir le catalogue",
            icon: ScanSearch,
            primary: true,
          },
          {
            href: "/dashboard/orders",
            label: "Mes commandes",
            icon: ClipboardList,
          },
          {
            href: "/dashboard/messages",
            label: "Messages",
            icon: MessageCircle,
          },
        ],
        cards: [
          {
            href: "/fishes",
            label: "Voir le catalogue",
            description:
              "Découvrez les poissons disponibles et trouvez rapidement ce qu’il vous faut.",
            icon: ScanSearch,
            color: "text-sky-700",
            bg: "bg-sky-100",
            border: "hover:border-sky-300 hover:bg-sky-50",
            cta: "Parcourir →",
          },
          {
            href: "/dashboard/orders",
            label: "Mes commandes",
            description:
              "Consultez l’historique et le suivi de vos commandes passées.",
            icon: ClipboardList,
            color: "text-emerald-700",
            bg: "bg-emerald-100",
            border: "hover:border-emerald-300 hover:bg-emerald-50",
            cta: "Consulter →",
          },
          {
            href: "/dashboard/messages",
            label: "Messages",
            description:
              "Suivez vos échanges avec les vendeurs avant ou après commande.",
            icon: MessageCircle,
            color: "text-violet-700",
            bg: "bg-violet-100",
            border: "hover:border-violet-300 hover:bg-violet-50",
            cta: "Ouvrir →",
          },
        ],
        recommendationsTitle: "Conseils d’achat",
        recommendations: [
          "Comparez les offres avant de commander.",
          "Vérifiez la localisation du vendeur.",
          "Utilisez la messagerie pour poser vos questions.",
        ],
      };

    case "ADMIN":
      return {
        title: "Espace administrateur",
        description:
          "Supervisez la plateforme, suivez l’activité globale et accédez à votre panneau d’administration complet.",
        badge: "Accès administrateur actif",
        badgeClassName: "bg-violet-100 text-violet-700",
        heroActions: [
          {
            href: "/admin",
            label: "Ouvrir l’administration",
            icon: ShieldCheck,
            primary: true,
          },
        ],
        cards: [
          {
            href: "/admin",
            label: "Ouvrir le dashboard admin",
            description:
              "Accédez à la vue générale de la plateforme pour piloter les utilisateurs, annonces, commandes, revenus et conversations.",
            icon: ShieldCheck,
            color: "text-violet-700",
            bg: "bg-violet-100",
            border: "hover:border-violet-300 hover:bg-violet-50",
            cta: "Ouvrir →",
            colSpan: "md:col-span-2",
          },
          {
            href: "/admin/users",
            label: "Utilisateurs",
            description:
              "Consultez les comptes acheteurs, vendeurs et administrateurs.",
            icon: UserRound,
            color: "text-sky-700",
            bg: "bg-sky-100",
            border: "hover:border-sky-300 hover:bg-sky-50",
            cta: "Gérer →",
          },
          {
            href: "/admin/orders",
            label: "Commandes",
            description:
              "Suivez l’ensemble des transactions et leur état global.",
            icon: ClipboardList,
            color: "text-orange-700",
            bg: "bg-orange-100",
            border: "hover:border-orange-300 hover:bg-orange-50",
            cta: "Superviser →",
          },
          {
            href: "/admin/fishes",
            label: "Annonces",
            description:
              "Visualisez toutes les annonces publiées et leur disponibilité.",
            icon: FishSymbol,
            color: "text-emerald-700",
            bg: "bg-emerald-100",
            border: "hover:border-emerald-300 hover:bg-emerald-50",
            cta: "Voir →",
          },
          {
            href: "/admin/conversations",
            label: "Conversations",
            description:
              "Contrôlez les échanges entre acheteurs et vendeurs.",
            icon: MessageCircle,
            color: "text-violet-700",
            bg: "bg-violet-100",
            border: "hover:border-violet-300 hover:bg-violet-50",
            cta: "Ouvrir →",
          },
          {
            label: "Pilotage global",
            description:
              "Utilisez votre espace admin comme point d’entrée principal pour superviser Fish Market.",
            icon: BadgeCheck,
            color: "text-slate-700",
            bg: "bg-slate-200",
            border: "",
            cta: "",
          },
        ],
        recommendationsTitle: "Recommandations administrateur",
        recommendations: [
          "Consultez régulièrement les commandes et conversations récentes.",
          "Vérifiez l’évolution des annonces disponibles sur la plateforme.",
          "Utilisez le dashboard admin comme point central de supervision.",
        ],
      };

    default:
      return {
        title: "Espace utilisateur",
        description: "Bienvenue sur votre espace personnel.",
        badge: "Compte actif",
        badgeClassName: "bg-slate-100 text-slate-700",
        heroActions: [],
        cards: [],
        recommendationsTitle: "Recommandations",
        recommendations: [],
      };
  }
}

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const initials = getInitials(user.name);
  const roleLabel = getRoleLabel(user.role);
  const roleDescription = getRoleDescription(user.role);
  const roleContent = getRoleContent(user.role);

  const profileFields = [
    user.name,
    user.phone,
    user.city,
    "email" in user ? user.email : null,
    user.profileImageUrl,
  ];

  const completedFields = profileFields.filter(Boolean).length;
  const completion = Math.round((completedFields / profileFields.length) * 100);

  const isSeller = user.role === "SELLER";
  const isVerified =
    isSeller && "isVerified" in user && typeof user.isVerified === "boolean"
      ? user.isVerified
      : false;

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-linear-to-r from-sky-700 via-cyan-700 to-emerald-600 text-white shadow-sm">
        <div className="px-6 py-8 md:px-8 md:py-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-sm font-medium backdrop-blur">
              Bienvenue sur votre espace Fish Market
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Bonjour, {user.name}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/90 sm:text-base">
              {roleDescription}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {roleContent.heroActions.map((action) => {
                const Icon = action.icon;

                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className={
                      action.primary
                        ? "inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-sky-700 transition hover:bg-slate-100"
                        : "inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                    }
                  >
                    <Icon className="h-4 w-4" />
                    {action.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[0.92fr_1.38fr]">
        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 overflow-hidden rounded-3xl border border-slate-200 bg-sky-100 shadow-sm">
                {user.profileImageUrl ? (
                  <Image
                    src={user.profileImageUrl}
                    alt={user.name || "Photo de profil"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-sky-700">
                    {initials}
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-3xl font-bold tracking-tight text-slate-900">
                  {user.name}
                </h2>
                <p className="mt-1 text-lg text-slate-500">{roleLabel}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                    Profil {completion}% complété
                  </span>

                  {isSeller && (
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${isVerified
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-orange-100 text-orange-700"
                        }`}
                    >
                      {isVerified ? "Vendeur vérifié" : "Vérification vendeur en attente"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="w-full rounded-3xl bg-slate-50 p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Profil
                </p>
                <span className="text-xs font-medium text-slate-500">
                  Espace personnel
                </span>
              </div>

              <div className="mt-4 grid gap-3">
                <div className="flex items-start gap-3 rounded-2xl bg-white px-4 py-3">
                  <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Téléphone
                    </p>
                    <p className="mt-1 text-base font-semibold text-slate-900">
                      {user.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-white px-4 py-3">
                  <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                    <Store className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Rôle
                    </p>
                    <p className="mt-1 text-base font-semibold text-slate-900">
                      {roleLabel}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-white px-4 py-3">
                  <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Ville
                    </p>
                    <p className="mt-1 text-base font-semibold text-slate-900">
                      {user.city || "Non renseignée"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-white px-4 py-3">
                  <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                    <UserRound className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Email
                    </p>
                    <p className="mt-1 break-all text-base font-semibold text-slate-900">
                      {"email" in user && user.email ? user.email : "Non renseigné"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-white px-4 py-3">
                  <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                    <BadgeCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Statut
                    </p>
                    <p className="mt-1 text-base font-semibold text-slate-900">
                      Compte actif
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                  <span>Complétude du profil</span>
                  <span>{completion}%</span>
                </div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-sky-600 transition-all"
                    style={{ width: `${completion}%` }}
                  />
                </div>
              </div>
            </div>

            <Link
              href="/dashboard/profile"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-600 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              <UserRound className="h-4 w-4" />
              Gérer mon profil
            </Link>

            <div className="w-full rounded-3xl border border-dashed border-slate-300 bg-slate-50/70 p-5">
              <p className="text-lg font-semibold text-slate-900">Conseil rapide</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Gardez vos informations à jour pour renforcer la confiance sur la
                plateforme, améliorer votre visibilité et faciliter les échanges.
              </p>
            </div>

            <div className="w-full md:hidden">
              <LogoutButton fullWidth />
            </div>
          </div>
        </aside>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  {roleContent.title}
                </h2>
                <p className="mt-1 text-slate-600">
                  {roleContent.description}
                </p>
              </div>

              <span
                className={`inline-flex w-fit rounded-full px-3 py-1 text-sm font-medium ${roleContent.badgeClassName}`}
              >
                {roleContent.badge}
              </span>
            </div>

            <div
              className={`mt-6 grid gap-4 ${user.role === "SELLER"
                  ? "sm:grid-cols-2 xl:grid-cols-4"
                  : user.role === "BUYER"
                    ? "md:grid-cols-3"
                    : "md:grid-cols-2 xl:grid-cols-4"
                }`}
            >
              {roleContent.cards.map((card) => {
                const Icon = card.icon;

                if (!card.href) {
                  return (
                    <div
                      key={card.label}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                    >
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.bg} ${card.color}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <h3 className="mt-4 text-lg font-semibold text-slate-900">
                        {card.label}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {card.description}
                      </p>
                    </div>
                  );
                }

                return (
                  <Link
                    key={card.href}
                    href={card.href}
                    className={`group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 ${card.border} ${card.colSpan || ""}`}
                  >
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.bg} ${card.color}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3 className="mt-4 text-lg font-semibold text-slate-900">
                      {card.label}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {card.description}
                    </p>

                    {card.cta && (
                      <p className={`mt-4 text-sm font-semibold ${card.color}`}>
                        {card.cta}
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">
                {roleContent.recommendationsTitle}
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {roleContent.recommendations.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}