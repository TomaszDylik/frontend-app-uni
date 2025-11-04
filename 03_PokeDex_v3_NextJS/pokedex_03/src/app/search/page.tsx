import Link from 'next/link';
import PokemonList from '@/components/PokemonList';

const POKEAPI = 'https://pokeapi.co/api/v2';

export const dynamic = 'force-dynamic'; // SSR

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

interface Type {
  name: string;
}

function extractIdFromUrl(url: string): number {
  const parts = url.split('/').filter(Boolean);
  return Number(parts[parts.length - 1]);
}

async function fetchAllPokemons(): Promise<Pokemon[]> {
  const listRes = await fetch(`${POKEAPI}/pokemon?limit=50`, {
    cache: 'no-store', // SSR - zawsze świeże dane
  });

  if (!listRes.ok) throw new Error(`Błąd listy: ${listRes.status}`);
  
  const listJson: { results: PokemonListItem[] } = await listRes.json();

  const detailed = await Promise.all(
    listJson.results.map(async (p) => {
      const id = extractIdFromUrl(p.url);
      const detRes = await fetch(`${POKEAPI}/pokemon/${id}`, {
        cache: 'no-store', // SSR
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

async function fetchTypes(): Promise<string[]> {
  const res = await fetch(`${POKEAPI}/type`, {
    cache: 'no-store', // SSR nie zapisujemy do cache
  });

  if (!res.ok) throw new Error(`Błąd typów: ${res.status}`);
  
  const json: { results: Type[] } = await res.json();
  return json.results.map((t) => t.name);
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ name?: string; type?: string }>;
}) {
  const params = await searchParams;
  const allPokemons = await fetchAllPokemons();
  const types = await fetchTypes();
  
  const searchName = params.name?.toLowerCase() || '';
  const searchType = params.type || '';

  // Filtrowanie na serwerze
  const filteredPokemons = allPokemons.filter((pokemon) => {
    const matchName = !searchName || 
      pokemon.name.includes(searchName) || 
      String(pokemon.id).includes(searchName);
    
    const matchType = !searchType || pokemon.types.includes(searchType);
    
    return matchName && matchType;
  });

  const timestamp = new Date().toLocaleString('pl-PL');

  return (
    <div id="root-app">
      <h1>GameDex - wyszukiwarka (SSR)</h1>
      
      <div style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '0.9rem', color: '#555' }}>
        Renderowano: {timestamp}
      </div>

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Link href="/" className="btn-secondary" style={{ padding: '0.8rem 1.5rem', textDecoration: 'none', display: 'inline-block' }}>
          ← Powrót do listy
        </Link>
      </div>

      <div className="search-section">
        <form className="search-container" method="get">
          <input
            type="text"
            name="name"
            placeholder="Szukaj po nazwie lub numerze..."
            className="search-input"
            defaultValue={searchName}
          />
          <button type="submit" className="search-button">
            Szukaj
          </button>
        </form>

        <div className="filters" style={{ marginTop: '1rem' }}>
          <label htmlFor="type-select" style={{ fontWeight: 'bold', marginBottom: '0.5rem', display: 'block' }}>
            Filtruj po typie:
          </label>
          <form method="get" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', alignItems: 'center' }}>
            <input type="hidden" name="name" value={searchName} />
            <select // rozsuwana lista typów
              id="type-select"
              name="type"
              className="filter-select"
              defaultValue={searchType}
              style={{
                padding: '0.5rem 1rem',
                border: '2px solid #23022E',
                borderRadius: '8px',
                background: '#F5F5F5',
                fontSize: '1rem',
              }}
            >
              <option value="">Wszystkie typy</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <button type="submit" className="btn-secondary">
              Filtruj
            </button>
          </form>
        </div>
      </div>

      {filteredPokemons.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', fontSize: '1.2rem' }}>
          Brak wyników dla podanych kryteriów wyszukiwania.
        </div>
      ) : (
        <>
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            Znaleziono: {filteredPokemons.length} Pokemonów
          </div>
          <PokemonList pokemons={filteredPokemons} />
        </>
      )}
    </div>
  );
}
