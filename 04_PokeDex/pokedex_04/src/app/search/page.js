'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PokemonList from '@/components/PokemonList';

const POKEAPI = 'https://pokeapi.co/api/v2';

// Wyciaga ID Pokemona z URL API
function extractIdFromUrl(url) {
  const parts = url.split('/').filter(Boolean);
  return Number(parts[parts.length - 1]);
}

// Pobiera liste Pokemonow z API
async function fetchPokemons() {
  const listRes = await fetch(`${POKEAPI}/pokemon?limit=50`);

  if (!listRes.ok) throw new Error(`Błąd listy: ${listRes.status}`);
  
  const listJson = await listRes.json();

  const detailed = await Promise.all(
    listJson.results.map(async (p) => {
      const id = extractIdFromUrl(p.url);
      const detRes = await fetch(`${POKEAPI}/pokemon/${id}`);
      
      if (!detRes.ok) throw new Error(`Błąd szczegółów ${id}: ${detRes.status}`);
      
      const d = await detRes.json();
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

// Pobiera dostepne typy Pokemonow
async function fetchTypes() {
  const res = await fetch(`${POKEAPI}/type`);
  if (!res.ok) throw new Error(`Błąd typów: ${res.status}`);
  const json = await res.json();
  return json.results.map((t) => t.name);
}

// Komponent strony wyszukiwania z filtrami
export default function SearchPage() {
  const [pokemons, setPokemons] = useState([]);
  const [types, setTypes] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchType, setSearchType] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [favorites] = useState([]);
  const toggleFavorite = () => {}; // Pusta funkcja - ulubione tylko na stronie glownej

  // Laduje dane przy montowaniu komponentu
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [pokemonsData, typesData] = await Promise.all([
          fetchPokemons(),
          fetchTypes()
        ]);
        setPokemons(pokemonsData);
        setTypes(typesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filtruje Pokemony wedlug kryteriow wyszukiwania
  const filteredPokemons = pokemons.filter((pokemon) => {
    const matchName = !searchName || 
      pokemon.name.toLowerCase().includes(searchName.toLowerCase()) || 
      String(pokemon.id).includes(searchName);
    
    const matchType = !searchType || pokemon.types.includes(searchType);
    
    return matchName && matchType;
  });

  if (loading) {
    return (
      <div id="root-app">
        <h1>GameDex - wyszukiwarka</h1>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Ładowanie...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div id="root-app">
        <h1>GameDex - wyszukiwarka</h1>
        <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
          <p>Błąd: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div id="root-app">
      <h1>GameDex - wyszukiwarka</h1>
      
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Link href="/" className="btn-secondary" style={{ padding: '0.8rem 1.5rem', textDecoration: 'none', display: 'inline-block' }}>
          ← Powrót do listy
        </Link>
      </div>

      <div className="search-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Szukaj po nazwie lub numerze..."
            className="search-input"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>

        <div className="filters" style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <label htmlFor="type-select" style={{ fontWeight: 'bold', marginRight: '1rem' }}>
            Filtruj po typie:
          </label>
          <select
            id="type-select"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="filter-select"
            style={{
              padding: '0.6rem 1.2rem',
              border: '2px solid #23022E',
              borderRadius: '8px',
              background: '#F5F5F5',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            <option value="">Wszystkie typy</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredPokemons.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', fontSize: '1.2rem' }}>
          Brak wyników dla podanych kryteriów wyszukiwania.
        </div>
      ) : (
        <>
          <div style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '1.1rem' }}>
            Znaleziono: <strong>{filteredPokemons.length}</strong> Pokemonów
          </div>
          <PokemonList 
            pokemons={filteredPokemons} 
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
        </>
      )}
    </div>
  );
}
