import Link from 'next/link';
import Image from 'next/image';

const POKEAPI = 'https://pokeapi.co/api/v2';

// Generuje statyczne parametry dla 50 Pokemonow (SSG)
export async function generateStaticParams() {
  return Array.from({ length: 50 }, (_, i) => ({
    id: String(i + 1),
  }));
}

// Pobiera szczegoly wybranego Pokemona
async function fetchPokemonDetails(id) {
  const res = await fetch(`${POKEAPI}/pokemon/${id}`, {
    cache: 'force-cache', // SSG - cache forever
  });

  if (!res.ok) throw new Error(`Nie udało się pobrać szczegółów (${res.status})`);
  
  return await res.json();
}

// Komponent strony szczegolowych informacji o Pokemonie
export default async function PokemonPage({ params }) {
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
          <Image 
            src={img} 
            alt={details.name}
            width={300}
            height={300}
            style={{ objectFit: 'contain' }}
            unoptimized
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

          <h3>Podstawowe statystyki:</h3>
          <div className="stats-container">
            {details.stats.map((stat) => (
              <div key={stat.stat.name} className="stat-row">
                <span className="stat-name">{stat.stat.name}:</span>
                <div className="stat-bar-container">
                  <div 
                    className="stat-bar"
                    style={{ 
                      width: `${Math.min(stat.base_stat, 255) / 255 * 100}%`,
                    }}
                  />
                </div>
                <span className="stat-value">{stat.base_stat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
