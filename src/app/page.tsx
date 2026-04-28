"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import {
  getPokemonList,
  getPokemonTypes,
  getPokemonByType,
  PokemonResult,
} from "@/lib/pokeapi";
import { PokemonCard } from "@/components/PokemonCard";
import { PokemonModal } from "@/components/PokemonModal";

export default function Home() {
  const [pokemon, setPokemon] = useState<PokemonResult[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination & Search & Filter states
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Modal state
  const [selectedPokemonName, setSelectedPokemonName] = useState<string | null>(
    null
  );

  const LIMIT = 20;

  // Load favorites from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("pokedex-favorites");
      if (stored) {
        setFavorites(new Set(JSON.parse(stored)));
      }
    } catch (e) {
      console.error("Failed to load favorites", e);
    }
  }, []);

  // Save favorites to local storage when changed
  useEffect(() => {
    try {
      localStorage.setItem(
        "pokedex-favorites",
        JSON.stringify(Array.from(favorites))
      );
    } catch (e) {
      console.error("Failed to save favorites", e);
    }
  }, [favorites]);

  const toggleFavorite = useCallback(
    (e: React.MouseEvent, p: PokemonResult) => {
      e.stopPropagation();
      setFavorites((prev) => {
        const next = new Set(prev);
        if (next.has(p.name)) {
          next.delete(p.name);
        } else {
          next.add(p.name);
        }
        return next;
      });
    },
    []
  );

  // Fetch initial types
  useEffect(() => {
    getPokemonTypes()
      .then((data) => setTypes(data.results.map((t) => t.name)))
      .catch(console.error);
  }, []);

  // Main data fetching logic
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (selectedType) {
          // If a type is selected, fetch all pokemon of that type
          // The API doesn't support pagination here easily, so we just get them all and paginate client-side or just show them.
          // For simplicity in a lite app, we'll slice the result for client-side pagination.
          const data = await getPokemonByType(selectedType);
          const formattedResults = data.pokemon.map((p) => p.pokemon);

          // Apply search filter on the typed list
          let filtered = formattedResults;
          if (searchQuery) {
            filtered = formattedResults.filter((p) =>
              p.name.includes(searchQuery.toLowerCase())
            );
          }

          if (isMounted) {
            setTotalCount(filtered.length);
            // Client side slice for pagination
            setPokemon(filtered.slice(offset, offset + LIMIT));
          }
        } else if (searchQuery) {
          // If searching without type, we need to search across all or a large list.
          // The PokeAPI doesn't have a direct search endpoint, so we fetch a large batch (e.g. 1000) and filter client side.
          // To be efficient for a lite app, we'll fetch first 1000.
          const data = await getPokemonList(1000, 0);
          const filtered = data.results.filter((p) =>
            p.name.includes(searchQuery.toLowerCase())
          );
          if (isMounted) {
            setTotalCount(filtered.length);
            setPokemon(filtered.slice(offset, offset + LIMIT));
          }
        } else {
          // Normal paginated fetching
          const data = await getPokemonList(LIMIT, offset);
          if (isMounted) {
            setTotalCount(data.count);
            setPokemon(data.results);
          }
        }
      } catch (err) {
        if (isMounted) setError("Failed to fetch Pokémon data. Please try again.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    // Debounce search
    const timer = setTimeout(() => {
      loadData();
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [offset, selectedType, searchQuery]);

  // Reset pagination when filters change
  useEffect(() => {
    setOffset(0);
  }, [selectedType, searchQuery]);

  return (
    <main className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 px-4 py-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500 text-white shadow-lg shadow-red-500/20">
              <Sparkles size={20} />
            </div>
            <h1 className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-2xl font-black tracking-tight text-transparent">
              Pokedex<span className="font-light">Lite</span>
            </h1>
          </div>

          <div className="flex w-full items-center gap-3 sm:w-auto">
            <div className="relative w-full sm:w-64">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search size={18} className="text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search Pokémon..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none transition-all focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-red-500 dark:focus:bg-slate-900"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        {/* Type Filter */}
        <div className="mb-8 overflow-x-auto pb-4 hide-scrollbar">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedType("")}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
                selectedType === ""
                  ? "bg-slate-900 text-white shadow-md dark:bg-white dark:text-slate-900"
                  : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              All Types
            </button>
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition-all ${
                  selectedType === type
                    ? "bg-red-500 text-white shadow-md shadow-red-500/20"
                    : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="my-12 rounded-2xl bg-red-50 p-6 text-center text-red-600 dark:bg-red-500/10 dark:text-red-400">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && pokemon.length === 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-[300px] animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800"
              />
            ))}
          </div>
        ) : !loading && pokemon.length === 0 ? (
          <div className="my-24 text-center">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900">
              <Search className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              No Pokémon found
            </h3>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <>
            {/* Pokemon Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {pokemon.map((p, index) => (
                <PokemonCard
                  key={p.name}
                  pokemon={p}
                  index={index}
                  isFavorite={favorites.has(p.name)}
                  onToggleFavorite={toggleFavorite}
                  onClick={(poke) => setSelectedPokemonName(poke.name)}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalCount > LIMIT && (
              <div className="mt-12 flex items-center justify-center gap-4">
                <button
                  disabled={offset === 0}
                  onClick={() => setOffset((prev) => Math.max(0, prev - LIMIT))}
                  className="rounded-xl bg-white px-6 py-2.5 font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-50 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Previous
                </button>
                <span className="text-sm font-medium text-slate-500">
                  Page {Math.floor(offset / LIMIT) + 1} of{" "}
                  {Math.ceil(totalCount / LIMIT)}
                </span>
                <button
                  disabled={offset + LIMIT >= totalCount}
                  onClick={() => setOffset((prev) => prev + LIMIT)}
                  className="rounded-xl bg-white px-6 py-2.5 font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-50 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <PokemonModal
        pokemonName={selectedPokemonName}
        onClose={() => setSelectedPokemonName(null)}
      />

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
}
