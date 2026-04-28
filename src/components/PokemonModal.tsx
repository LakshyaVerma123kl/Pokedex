import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Activity, Scale, Ruler } from "lucide-react";
import { getPokemonDetails, PokemonDetail } from "@/lib/pokeapi";

interface PokemonModalProps {
  pokemonName: string | null;
  onClose: () => void;
}

export function PokemonModal({ pokemonName, onClose }: PokemonModalProps) {
  const [details, setDetails] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pokemonName) return;
    
    let isMounted = true;
    setLoading(true);
    setError(null);
    
    getPokemonDetails(pokemonName)
      .then((data) => {
        if (isMounted) setDetails(data);
      })
      .catch(() => {
        if (isMounted) setError("Failed to load details");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [pokemonName]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (pokemonName) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [pokemonName]);

  const typeColors: Record<string, string> = {
    normal: "bg-stone-400 text-stone-900",
    fire: "bg-orange-500 text-white",
    water: "bg-blue-500 text-white",
    electric: "bg-yellow-400 text-yellow-900",
    grass: "bg-green-500 text-white",
    ice: "bg-cyan-300 text-cyan-900",
    fighting: "bg-red-600 text-white",
    poison: "bg-purple-500 text-white",
    ground: "bg-amber-600 text-white",
    flying: "bg-indigo-300 text-indigo-900",
    psychic: "bg-pink-500 text-white",
    bug: "bg-lime-500 text-lime-900",
    rock: "bg-amber-800 text-white",
    ghost: "bg-purple-800 text-white",
    dragon: "bg-indigo-600 text-white",
    dark: "bg-slate-800 text-white",
    steel: "bg-slate-400 text-slate-900",
    fairy: "bg-pink-300 text-pink-900",
  };

  return (
    <AnimatePresence>
      {pokemonName && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl md:max-w-4xl dark:bg-slate-900"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100/50 text-slate-500 backdrop-blur-md transition-colors hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800/50 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100"
            >
              <X size={20} />
            </button>

            {loading ? (
              <div className="flex h-96 items-center justify-center">
                 <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500 dark:border-slate-800 dark:border-t-blue-400" />
              </div>
            ) : error ? (
              <div className="flex h-96 items-center justify-center p-8 text-center text-red-500">
                {error}
              </div>
            ) : details ? (
              <div className="flex max-h-[85vh] flex-col overflow-y-auto md:flex-row md:overflow-hidden">
                <div className="relative flex h-64 shrink-0 items-center justify-center bg-slate-50 p-8 md:h-auto md:w-1/2 md:p-12 dark:bg-slate-800/50">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className="relative h-full w-full max-w-[280px]"
                  >
                    <Image
                      src={
                        details.sprites.other["official-artwork"].front_default ||
                        details.sprites.front_default
                      }
                      alt={details.name}
                      fill
                      className="object-contain drop-shadow-xl"
                      unoptimized
                    />
                  </motion.div>
                </div>

                <div className="p-6 sm:p-8 md:w-1/2 md:overflow-y-auto custom-scrollbar">
                  <div className="mb-6 flex items-end justify-between">
                    <div>
                      <h2 className="text-3xl font-bold capitalize text-slate-900 dark:text-white">
                        {details.name}
                      </h2>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {details.types.map((t) => (
                          <span
                            key={t.type.name}
                            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                              typeColors[t.type.name] || "bg-slate-200 text-slate-800"
                            }`}
                          >
                            {t.type.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="text-xl font-bold text-slate-300 dark:text-slate-700">
                      #{String(details.id).padStart(3, "0")}
                    </span>
                  </div>

                  <div className="mb-8 grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/50">
                      <div className="rounded-full bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                        <Scale size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Weight</p>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          {details.weight / 10} kg
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/50">
                      <div className="rounded-full bg-green-100 p-2 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                        <Ruler size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Height</p>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          {details.height / 10} m
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                      <Activity size={20} className="text-slate-400" />
                      Base Stats
                    </h3>
                    <div className="space-y-3">
                      {details.stats.map((s) => (
                        <div key={s.stat.name} className="flex items-center gap-4">
                          <span className="w-28 text-sm font-medium uppercase text-slate-500 dark:text-slate-400">
                            {s.stat.name.replace("-", " ")}
                          </span>
                          <div className="flex h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(100, (s.base_stat / 255) * 100)}%` }}
                              transition={{ duration: 0.5, delay: 0.2 }}
                              className={`h-full rounded-full ${
                                s.base_stat >= 100
                                  ? "bg-green-500"
                                  : s.base_stat >= 50
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                            />
                          </div>
                          <span className="w-8 text-right text-sm font-bold text-slate-900 dark:text-slate-100">
                            {s.base_stat}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Abilities
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {details.abilities.map((a) => (
                        <span
                          key={a.ability.name}
                          className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium capitalize text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        >
                          {a.ability.name.replace("-", " ")}
                          {a.is_hidden && <span className="ml-1 text-xs text-slate-400">(Hidden)</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
