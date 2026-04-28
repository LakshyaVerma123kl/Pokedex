import { memo } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { PokemonResult } from "@/lib/pokeapi";

interface PokemonCardProps {
  pokemon: PokemonResult;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent, pokemon: PokemonResult) => void;
  onClick: (pokemon: PokemonResult) => void;
}

export const PokemonCard = memo(function PokemonCard({
  pokemon,
  index,
  isFavorite,
  onToggleFavorite,
  onClick,
}: PokemonCardProps) {
  // Extract ID from URL
  const idMatch = pokemon.url.match(/\/(\d+)\/$/);
  const id = idMatch ? idMatch[1] : "";
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(pokemon)}
      className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-md dark:bg-slate-900 dark:ring-slate-800"
    >
      <div className="absolute right-3 top-3 z-10">
        <button
          onClick={(e) => onToggleFavorite(e, pokemon)}
          className={`rounded-full p-2 backdrop-blur-md transition-colors ${
            isFavorite
              ? "bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-500/20"
              : "bg-slate-50/50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:bg-slate-800/50 dark:hover:bg-slate-800"
          }`}
        >
          <Heart
            size={20}
            className={isFavorite ? "fill-current" : ""}
            strokeWidth={isFavorite ? 2.5 : 2}
          />
        </button>
      </div>
      
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-50 p-6 dark:bg-slate-800/50">
        <Image
          src={imageUrl}
          alt={pokemon.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain transition-transform duration-300 group-hover:scale-110"
          unoptimized // API returns direct images
        />
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold capitalize text-slate-900 dark:text-slate-100">
          {pokemon.name}
        </h3>
        <span className="text-sm font-medium text-slate-400">
          #{id.padStart(3, "0")}
        </span>
      </div>
    </motion.div>
  );
});
