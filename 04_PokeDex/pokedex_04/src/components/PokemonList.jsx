import PokemonCard from './PokemonCard';

// Komponent listy Pokemonow - renderuje karty
export default function PokemonList({ pokemons, favorites, toggleFavorite }) {
  return (
    <div className="list-section">
      {pokemons.map((pokemon) => (
        <PokemonCard
          key={pokemon.id}
          id={pokemon.id}
          name={pokemon.name}
          img={pokemon.img}
          types={pokemon.types}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
        />
      ))}
    </div>
  );
}
