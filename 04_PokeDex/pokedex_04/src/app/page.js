'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PokemonList from '@/components/PokemonList';
import FavoritesCounter from '@/components/FavoritesCounter';

const POKEAPI = 'https://pokeapi.co/api/v2';

// Wyciaga ID Pokemona z URL API
function extractIdFromUrl(url) {
  const parts = url.split('/').filter(Boolean);
  return Number(parts[parts.length - 1]);
}

// Pobiera liste 50 Pokemonow z API wraz ze szczegolami
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

// Glowny komponent strony - lista Pokemonow z ulubionymi
export default function Home() {
  // Zarzadzanie stanem - podniesienie stanu w gore
  const [pokemons, setPokemons] = useState([]);
  const [favorites, setFavorites] = useState([]); // Tablica ID ulubionych
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [limitMessage, setLimitMessage] = useState('');

  // Laduje Pokemony przy montowaniu komponentu
  useEffect(() => {
    async function loadPokemons() {
      try {
        setLoading(true);
        const data = await fetchPokemons();
        setPokemons(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    loadPokemons();
  }, []);

  // Przelacza status ulubionego - przekazywane do komponentow potomnych
  const toggleFavorite = (pokemonId) => {
    setFavorites((prevFavorites) => {
      // Jesli Pokemon juz jest ulubiony, usun go
      if (prevFavorites.includes(pokemonId)) {
        setLimitMessage('');
        return prevFavorites.filter((id) => id !== pokemonId);
      }
      
      // Sprawdza limit przed dodaniem (max 12)
      if (prevFavorites.length >= 12) {
        setLimitMessage('Osiągnięto limit 12 ulubionych Pokemonów!');
        // Ukrywa komunikat po 3 sekundach
        setTimeout(() => setLimitMessage(''), 3000);
        return prevFavorites;
      }
      
      // Dodaje do ulubionych
      setLimitMessage('');
      return [...prevFavorites, pokemonId];
    });
  };

  if (loading) {
    return (
      <div id="root-app">
        <h1>GameDex - wyszukiwarka Pokemonów</h1>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Ładowanie Pokemonów...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div id="root-app">
        <h1>GameDex - wyszukiwarka Pokemonów</h1>
        <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
          <p>Błąd: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div id="root-app">
      <h1>GameDex - wyszukiwarka Pokemonów</h1>
      
      <FavoritesCounter count={favorites.length} />

      {limitMessage && (
        <div style={{
          textAlign: 'center',
          backgroundColor: '#ff6b6b',
          color: 'white',
          padding: '1rem',
          margin: '1rem auto',
          borderRadius: '8px',
          maxWidth: '500px',
          fontWeight: 'bold'
        }}>
          {limitMessage}
        </div>
      )}

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Link href="/search" className="btn-secondary" style={{ padding: '0.8rem 1.5rem', textDecoration: 'none', display: 'inline-block' }}>
          🔍 Przejdź do wyszukiwarki
        </Link>
      </div>

      <PokemonList 
        pokemons={pokemons} 
        favorites={favorites} 
        toggleFavorite={toggleFavorite}
      />
    </div>
  );
}
