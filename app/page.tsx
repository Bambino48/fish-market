import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import {
  ArrowRight,
  BadgeCheck,
  ClipboardList,
  FishSymbol,
  MapPin,
  ShieldCheck,
  ShoppingBasket,
  Store,
  UserPlus,
  Layers3,
  Clock3,
  Users,
  CheckCircle2,
  Building2,
  HelpCircle,
} from "lucide-react";

export default async function HomePage() {
  const user = await getSessionUser();

  return (
    <main className="bg-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-sm font-medium text-orange-700">
              <FishSymbol className="h-4 w-4" />
              Marketplace locale du poisson
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Fish Market San Pedro
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
              Achetez et vendez du poisson frais en ligne à San Pedro. Une
              plateforme moderne pour connecter vendeurs, restaurants, hôtels,
              poissonneries et acheteurs en toute simplicité.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/fishes"
                className="inline-flex items-center gap-2 rounded-2xl bg-orange-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700"
              >
                <ShoppingBasket className="h-4 w-4" />
                Voir le catalogue
              </Link>

              {!user ? (
                <>
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
                  >
                    <UserPlus className="h-4 w-4" />
                    Créer un compte
                  </Link>

                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
                  >
                    <ArrowRight className="h-4 w-4" />
                    Se connecter
                  </Link>
                </>
              ) : (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-100"
                >
                  <Store className="h-4 w-4" />
                  Aller au dashboard
                </Link>
              )}
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                  <Store className="h-5 w-5" />
                </div>
                <h2 className="mt-3 text-sm font-semibold text-slate-900">
                  Vendeurs locaux
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Publiez vos produits et développez votre activité.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <BadgeCheck className="h-5 w-5" />
                </div>
                <h2 className="mt-3 text-sm font-semibold text-slate-900">
                  Transactions simples
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Une expérience fluide pour consulter et commander rapidement.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                  <MapPin className="h-5 w-5" />
                </div>
                <h2 className="mt-3 text-sm font-semibold text-slate-900">
                  Ancré à San Pedro
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Une plateforme pensée pour le marché local du poisson.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-orange-50 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                  <Store className="h-5 w-5" />
                </div>

                <h2 className="mt-4 text-xl font-semibold text-slate-900">
                  Pour les vendeurs
                </h2>

                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Publiez vos poissons, ajoutez des images, gérez vos annonces
                  et suivez vos commandes reçues.
                </p>
              </div>

              <div className="rounded-3xl bg-sky-50 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                  <ShoppingBasket className="h-5 w-5" />
                </div>

                <h2 className="mt-4 text-xl font-semibold text-slate-900">
                  Pour les acheteurs
                </h2>

                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Consultez le catalogue, comparez les offres disponibles et
                  commandez facilement selon vos besoins.
                </p>
              </div>

              <div className="rounded-3xl bg-emerald-50 p-6 sm:col-span-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <ClipboardList className="h-5 w-5" />
                </div>

                <h2 className="mt-4 text-xl font-semibold text-slate-900">
                  Flux simple et rapide
                </h2>

                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Publication de l’offre → consultation du catalogue → commande
                  → confirmation du vendeur.
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                  <ShieldCheck className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    Une base solide pour la suite
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Cette plateforme est conçue pour évoluer avec des espaces
                    dédiés aux vendeurs, acheteurs et à l’administration.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
              Comment ça marche
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              Un parcours simple du dépôt à la commande
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Fish Market simplifie les échanges entre vendeurs et acheteurs avec
              une logique claire, rapide et facile à comprendre.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                <Store className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                1. Le vendeur publie
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Il ajoute son poisson, ses détails, son prix et ses images.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                <FishSymbol className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                2. L’acheteur consulte
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Il parcourt le catalogue et choisit l’offre adaptée à son besoin.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <ShoppingBasket className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                3. La commande est passée
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                L’acheteur commande directement depuis la plateforme.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                4. Le vendeur confirme
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Le suivi devient plus simple grâce à un espace dédié aux commandes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
            Avantages
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            Les bénéfices concrets de la plateforme
          </h2>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
              <Layers3 className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              Interface claire
            </h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Une navigation simple pour publier, consulter et suivre les actions.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <Clock3 className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              Gain de temps
            </h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Les utilisateurs trouvent plus vite l’information utile et agissent plus rapidement.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              Usage multi-profils
            </h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Convient aux vendeurs, restaurateurs, hôtels et acheteurs particuliers.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
              <ClipboardList className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              Suivi simplifié
            </h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Les commandes et les annonces sont regroupées dans des espaces dédiés.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
              Pour qui
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              Une plateforme utile pour plusieurs types d’utilisateurs
            </h2>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                <Store className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                Vendeurs
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Publiez vos offres, mettez en valeur vos produits et gérez vos commandes.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                <Building2 className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                Restaurants et hôtels
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Trouvez rapidement les produits disponibles pour vos besoins professionnels.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <ShoppingBasket className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                Acheteurs
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Consultez les offres, commandez et suivez facilement vos achats.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-4xl border border-slate-200 bg-linear-to-r from-slate-900 via-slate-800 to-sky-900 p-8 text-white shadow-lg">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200">
                Passez à l’action
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight">
                Commencez à utiliser Fish Market dès maintenant
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/80 sm:text-base">
                Explorez le catalogue ou créez votre espace pour profiter d’un
                parcours simple et structuré.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/fishes"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                <FishSymbol className="h-4 w-4" />
                Explorer le catalogue
              </Link>

              {!user ? (
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  <UserPlus className="h-4 w-4" />
                  Créer un compte
                </Link>
              ) : (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  <ArrowRight className="h-4 w-4" />
                  Ouvrir mon dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
              Questions fréquentes
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              FAQ rapide
            </h2>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex items-start gap-3">
                <HelpCircle className="mt-1 h-5 w-5 text-sky-700" />
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    Faut-il créer un compte pour utiliser la plateforme ?
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Vous pouvez consulter certaines pages, mais un compte est nécessaire pour publier ou suivre vos commandes.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex items-start gap-3">
                <HelpCircle className="mt-1 h-5 w-5 text-sky-700" />
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    Qui peut vendre sur Fish Market ?
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Les vendeurs locaux disposant d’un compte peuvent publier leurs annonces sur la plateforme.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex items-start gap-3">
                <HelpCircle className="mt-1 h-5 w-5 text-sky-700" />
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    Comment un acheteur passe-t-il une commande ?
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Il consulte le catalogue, choisit une offre et valide son action depuis son espace utilisateur.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex items-start gap-3">
                <HelpCircle className="mt-1 h-5 w-5 text-sky-700" />
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    Où suivre les commandes ?
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Les acheteurs et vendeurs disposent chacun d’un espace dédié pour consulter leurs commandes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}