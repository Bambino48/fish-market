"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import {
    FishSymbol,
    MapPin,
    RotateCcw,
    Search,
    SlidersHorizontal,
    Loader2,
} from "lucide-react";

export default function FishFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [species, setSpecies] = useState(searchParams.get("species") || "");
    const [location, setLocation] = useState(searchParams.get("location") || "");

    function handleFilter(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const params = new URLSearchParams();

        if (search.trim()) {
            params.set("search", search.trim());
        }

        if (species.trim()) {
            params.set("species", species.trim());
        }

        if (location.trim()) {
            params.set("location", location.trim());
        }

        startTransition(() => {
            const query = params.toString();
            router.push(query ? `/fishes?${query}` : "/fishes");
        });
    }

    function handleReset() {
        setSearch("");
        setSpecies("");
        setLocation("");

        startTransition(() => {
            router.push("/fishes");
        });
    }

    return (
        <form onSubmit={handleFilter} className="space-y-5">
            <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                    <SlidersHorizontal className="h-5 w-5" />
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                        Filtrer les annonces
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                        Utilisez les champs ci-dessous pour rechercher par titre, espèce ou
                        lieu.
                    </p>
                </div>
            </div>

            <div className="grid gap-4">
                <div className="space-y-2">
                    <label
                        htmlFor="search"
                        className="text-sm font-medium text-slate-700"
                    >
                        Recherche
                    </label>

                    <div className="relative">
                        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            id="search"
                            type="text"
                            placeholder="Rechercher par titre ou description..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                        />
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <label
                            htmlFor="species"
                            className="text-sm font-medium text-slate-700"
                        >
                            Espèce
                        </label>

                        <div className="relative">
                            <FishSymbol className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                id="species"
                                type="text"
                                placeholder="Ex : Thon, Capitaine..."
                                value={species}
                                onChange={(e) => setSpecies(e.target.value)}
                                className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="location"
                            className="text-sm font-medium text-slate-700"
                        >
                            Lieu
                        </label>

                        <div className="relative">
                            <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                id="location"
                                type="text"
                                placeholder="Ex : San Pedro..."
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Recherche...
                        </>
                    ) : (
                        <>
                            <Search className="h-4 w-4" />
                            Rechercher
                        </>
                    )}
                </button>

                <button
                    type="button"
                    onClick={handleReset}
                    disabled={isPending}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    <RotateCcw className="h-4 w-4" />
                    Réinitialiser
                </button>
            </div>
        </form>
    );
}