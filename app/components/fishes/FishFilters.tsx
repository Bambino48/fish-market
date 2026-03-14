"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function FishFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [species, setSpecies] = useState(searchParams.get("species") || "");
    const [location, setLocation] = useState(searchParams.get("location") || "");

    function handleFilter(e: React.FormEvent) {
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

        router.push(`/fishes?${params.toString()}`);
    }

    function handleReset() {
        setSearch("");
        setSpecies("");
        setLocation("");
        router.push("/fishes");
    }

    return (
        <form onSubmit={handleFilter} className="mt-6 rounded-xl border p-4 space-y-4">
            <h2 className="text-lg font-semibold">Recherche et filtres</h2>

            <input
                type="text"
                placeholder="Rechercher par titre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border rounded-lg p-3"
            />

            <input
                type="text"
                placeholder="Filtrer par espèce..."
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                className="w-full border rounded-lg p-3"
            />

            <input
                type="text"
                placeholder="Filtrer par lieu..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border rounded-lg p-3"
            />

            <div className="flex gap-3 flex-wrap">
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                    Rechercher
                </button>

                <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2 bg-gray-200 rounded-lg"
                >
                    Réinitialiser
                </button>
            </div>
        </form>
    );
}