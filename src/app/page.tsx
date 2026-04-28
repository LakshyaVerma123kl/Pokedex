import { getPokemonList, getPokemonTypes } from "@/lib/pokeapi";
import { PokemonList } from "@/components/PokemonList";

// This is a Server Component — it fetches data on the server before
// sending the rendered HTML to the client. This gives us faster initial
// page loads and better SEO since crawlers see fully rendered content.
export default async function Home() {
  const [initialData, typesData] = await Promise.all([
    getPokemonList(20, 0),
    getPokemonTypes(),
  ]);

  // Filter out types that don't really have pokemon (like "unknown" and "shadow")
  const validTypes = typesData.results
    .map((t) => t.name)
    .filter((name) => name !== "unknown" && name !== "shadow");

  return (
    <PokemonList initialData={initialData} initialTypes={validTypes} />
  );
}
