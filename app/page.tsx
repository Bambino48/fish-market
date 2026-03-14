import Link from "next/link";
import { getSessionUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await getSessionUser();

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Fish Market San Pedro</h1>
      <p className="mt-4">MVP en cours de développement.</p>

      <div className="mt-6 flex gap-4">
        {!user ? (
          <>
            <Link
              href="/register"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Inscription
            </Link>

            <Link
              href="/login"
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              Connexion
            </Link>
          </>
        ) : (
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-black text-white rounded-lg"
          >
            Aller au dashboard
          </Link>
        )}
      </div>
    </main>
  );
}