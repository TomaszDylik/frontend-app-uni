import Link from 'next/link';
import StatsDisplay from '@/components/StatsDisplay';
import ToggleButton from '@/components/ToggleButton';

const POKEAPI = 'https://pokeapi.co/api/v2';

interface PokemonDetails {
  id: number;
  name: string;
  height: number;
  weight: number;
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
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
  abilities: Array<{
    ability: {
      name: string;
    };
    is_hidden: boolean;
  }>;
}

// Generowanie statycznych parametrów dla 50 Pokemonów
export async function generateStaticParams() {
  return Array.from({ length: 50 }, (_, i) => ({
    id: String(i + 1),
  }));
}

async function fetchPokemonDetails(id: string): Promise<PokemonDetails> {
  const res = await fetch(`${POKEAPI}/pokemon/${id}`, {
    cache: 'force-cache', // SSG
  });

  if (!res.ok) throw new Error(`Nie udało się pobrać szczegółów (${res.status})`);
  
  return await res.json();
}

export default async function PokemonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const details = await fetchPokemonDetails(id);

  const img =
    details?.sprites?.other?.['official-artwork']?.front_default ||
    details?.sprites?.front_default ||
    '';

  return (
    <div id="root-app">
      <h1>GameDex - szczegóły Pokemona</h1>
      
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Link href="/" className="btn-secondary" style={{ padding: '0.8rem 1.5rem', textDecoration: 'none', display: 'inline-block', marginRight: '1rem' }}>
          ← Powrót do listy
        </Link>
        <Link href="/search" className="btn-secondary" style={{ padding: '0.8rem 1.5rem', textDecoration: 'none', display: 'inline-block' }}>
          🔍 Wyszukiwarka
        </Link>
      </div>

      <div className="details-section">
        <div className="first-col">
          <h1>{details.name}</h1>
          <img 
            src={img} 
            alt={details.name}
            style={{ width: '300px', height: '300px', objectFit: 'contain' }}
          />
          <p><strong>Numer:</strong> #{details.id}</p>
          <p><strong>Wzrost:</strong> {details.height}</p>
          <p><strong>Waga:</strong> {details.weight}</p>

          <h3>Typy:</h3>
          <div className="typesBox">
            {details.types.map((t) => (
              <div key={t.type.name} className="typBox">
                {t.type.name}
              </div>
            ))}
          </div>

          <ToggleButton buttonLabel="Pokaż/Ukryj Umiejętności">
            <div>
              <h3>Umiejętności:</h3>
              <ul className="abilities">
                {details.abilities.map((a) => (
                  <li
                    key={a.ability.name}
                    className={a.is_hidden ? 'ability ability--hidden' : 'ability'}
                  >
                    {a.ability.name} {a.is_hidden ? '(ukryta)' : ''}
                  </li>
                ))}
              </ul>
            </div>
          </ToggleButton>
        </div>

        <div className="second-col">
          <h3>Podstawowe statystyki:</h3>
          <StatsDisplay stats={details.stats} />
        </div>
      </div>
    </div>
  );
}
