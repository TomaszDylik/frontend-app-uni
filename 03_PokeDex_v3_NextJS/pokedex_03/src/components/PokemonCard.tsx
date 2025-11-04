import Link from 'next/link';
import Image from 'next/image';

interface PokemonCardProps {
  id: number;
  name: string;
  img: string;
  types: string[];
}

export default function PokemonCard({ id, name, img, types }: PokemonCardProps) {
  return (
    <Link href={`/pokemon/${id}`} className="pokemon-list-item">
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
