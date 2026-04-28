export const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2";

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonResult[];
}

export interface PokemonResult {
  name: string;
  url: string;
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
    front_default: string;
  };
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  stats: {
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }[];
  abilities: {
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }[];
}

export interface TypeListResponse {
  count: number;
  results: {
    name: string;
    url: string;
  }[];
}

export async function getPokemonList(limit = 20, offset = 0): Promise<PokemonListResponse> {
  const res = await fetch(`${POKEAPI_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  if (!res.ok) throw new Error("Failed to fetch pokemon list");
  return res.json();
}

export async function getPokemonDetails(nameOrId: string | number): Promise<PokemonDetail> {
  const res = await fetch(`${POKEAPI_BASE_URL}/pokemon/${nameOrId}`);
  if (!res.ok) throw new Error(`Failed to fetch details for ${nameOrId}`);
  return res.json();
}

export async function getPokemonTypes(): Promise<TypeListResponse> {
  const res = await fetch(`${POKEAPI_BASE_URL}/type`);
  if (!res.ok) throw new Error("Failed to fetch pokemon types");
  return res.json();
}

export async function getPokemonByType(type: string): Promise<{ pokemon: { pokemon: PokemonResult }[] }> {
  const res = await fetch(`${POKEAPI_BASE_URL}/type/${type}`);
  if (!res.ok) throw new Error(`Failed to fetch pokemon of type ${type}`);
  return res.json();
}
