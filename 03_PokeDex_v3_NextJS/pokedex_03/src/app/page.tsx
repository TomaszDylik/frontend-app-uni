import Link from 'next/link';
import PokemonList from '@/components/PokemonList';

const POKEAPI = 'https://pokeapi.co/api/v2';

// structures
interface PokemonListItem {
  name: string;
  url: string;
}

interface PokemonDetails {
  id: number;
  name: string;
  sprites: {
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
    front_default: string;
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
}

interface Pokemon {
  id: number;
  name: string;
  img: string;
  types: string[];
}

// helper functions
function extractIdFromUrl(url: string): number {
  const parts = url.split('/').filter(Boolean);
  return Number(parts[parts.length - 1]);
}

async function fetchPokemons(): Promise<Pokemon[]> {
  const listRes = await fetch(`${POKEAPI}/pokemon?limit=50`, {
    cache: 'force-cache', // SSG
  });

  if (!listRes.ok) throw new Error(`Błąd listy: ${listRes.status}`);
  
  const listJson: { results: PokemonListItem[] } = await listRes.json();

  const detailed = await Promise.all(
    listJson.results.map(async (p) => {
      const id = extractIdFromUrl(p.url);
      const detRes = await fetch(`${POKEAPI}/pokemon/${id}`, {
        cache: 'force-cache', // SSG
      });
      
      if (!detRes.ok) throw new Error(`Błąd szczegółów ${id}: ${detRes.status}`);
      
      const d: PokemonDetails = await detRes.json();
      const img =
        d?.sprites?.other?.['official-artwork']?.front_default ||
        d?.sprites?.front_default ||
        '';
      const types = d.types.map((t) => t.type.name);
      
      return { id, name: p.name, img, types };
    })
  );

  return detailed;
}

export default async function Home() {
  const pokemons = await fetchPokemons();

  return (
    <div id="root-app">
      <h1>GameDex - wyszukiwarka Pokemonów (Next.js SSG)</h1>
      
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Link href="/search" className="btn-secondary" style={{ padding: '0.8rem 1.5rem', textDecoration: 'none', display: 'inline-block' }}>
          🔍 Przejdź do wyszukiwarki
        </Link>
      </div>

      <PokemonList pokemons={pokemons} />
    </div>
  );
}
