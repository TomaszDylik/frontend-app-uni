import PokemonCard from './PokemonCard';

interface Pokemon {
  id: number;
  name: string;
  img: string;
  types: string[];
}

interface PokemonListProps {
  pokemons: Pokemon[];
}

export default function PokemonList({ pokemons }: PokemonListProps) {
  return (
    <div className="list-section">
      {pokemons.map((pokemon) => (
        <PokemonCard
          key={pokemon.id}
          id={pokemon.id}
          name={pokemon.name}
          img={pokemon.img}
          types={pokemon.types}
        />
      ))}
    </div>
  );
}
