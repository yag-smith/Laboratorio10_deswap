import Link from "next/link";
import Image from "next/image";
import { RickMortyCharacter, RickMortyResponse } from "@/types/rickandmorty";

// SSG: cache: 'force-cache' fuerza pre-generación estática en build
async function getAllCharacters(): Promise<RickMortyCharacter[]> {
  const all: RickMortyCharacter[] = [];
  let url: string | null = "https://rickandmortyapi.com/api/character";

  while (url) {
    const res: Response = await fetch(url, {
  cache: "force-cache",
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept": "application/json",
  },
});
    if (!res.ok) throw new Error("Error al cargar personajes");
    const data: RickMortyResponse = await res.json();
    all.push(...data.results);
    url = data.info.next;
  }
  return all;
}

const statusColors: Record<string, string> = {
  Alive: "bg-green-500",
  Dead: "bg-red-500",
  unknown: "bg-gray-500",
};

export default async function CharactersPage() {
  const characters = await getAllCharacters();

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
          Personajes (SSG)
        </h1>
        <p className="text-green-300 mb-8">
          {characters.length} personajes pre-generados en build time
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {characters.map((character) => (
            <Link
              key={character.id}
              href={`/characters/${character.id}`}
              className="transform transition hover:scale-105"
            >
              <div className="bg-slate-900/80 backdrop-blur rounded-xl shadow-lg overflow-hidden hover:shadow-green-400/30 border border-green-500/10 h-full">
                <div className="relative aspect-square">
                  <Image
                    src={character.image}
                    alt={character.name}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                    loading="lazy"
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-white font-bold text-lg truncate">
                    {character.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`${statusColors[character.status]} w-2 h-2 rounded-full inline-block`}
                    />
                    <span className="text-gray-300 text-sm">
                      {character.status} - {character.species}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}