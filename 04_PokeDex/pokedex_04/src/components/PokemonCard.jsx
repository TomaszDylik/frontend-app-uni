'use client';

import Link from 'next/link';
import Image from 'next/image';
import FavoriteButton from './FavoriteButton';

// Komponent karty pojedynczego Pokemona
export default function PokemonCard({ id, name, img, types, favorites, toggleFavorite }) {
  const isFavorite = favorites.includes(id);

  return (
    <Link href={`/pokemon/${id}`} className="pokemon-list-item">
      <FavoriteButton 
        isFavorite={isFavorite}
        onToggle={() => toggleFavorite(id)}
      />
      
      <span className="pokemon-name">{name}</span>
      <Image 
        className="pokemon-image" 
        src={img} 
        alt={name} 
        width={144} 
        height={144}
        unoptimized
      />
      <div className="mini-types">
        {types.map((type) => (
          <span key={type} className="typBox typBox--small">
            {type}
          </span>
        ))}
      </div>
    </Link>
  );
}
