import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { RickMortyCharacter, RickMortyResponse } from "@/types/rickandmorty";

interface CharacterPageProps {
  params: Promise<{ id: string }>;
}

// ISR: revalida cada 10 días (864000 segundos)
async function getCharacter(id: string): Promise<RickMortyCharacter> {
  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept": "application/json",
  };

  // Hasta 5 intentos con backoff exponencial: 1s, 2s, 4s, 8s
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`, {
      next: { revalidate: 864000 },
      headers,
    });

    if (res.status === 404) notFound();
    if (res.status === 429 && attempt < 4) {
      await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt)));
      continue;
    }
    if (!res.ok) throw new Error("Error al cargar el personaje");
    return res.json();
  }

  throw new Error("Error al cargar el personaje (rate-limited)");
}

// SSG: pre-genera todas las rutas estáticas en build time
export async function generateStaticParams() {
  // En dev no pre-generamos (evita rate limits)
  if (process.env.NODE_ENV !== "production") {
    return [];
  }

  const all: { id: string }[] = [];
  const MAX_PAGES = 5; // 100 personajes pre-generados; el resto va por ISR on-demand
  let url: string | null = "https://rickandmortyapi.com/api/character";
  let pageCount = 0;

  try {
    while (url && pageCount < MAX_PAGES) {
      const res: Response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Accept": "application/json",
        },
      });

      if (!res.ok) {
        console.warn(`generateStaticParams: skip ${url} (status ${res.status})`);
        break;
      }

      const data: RickMortyResponse = await res.json();
      if (!data?.results) break;

      data.results.forEach((c) => all.push({ id: c.id.toString() }));
      url = data.info?.next ?? null;
      pageCount++;
    }
  } catch (error) {
    console.error("generateStaticParams error:", error);
  }

  return all;
}

export async function generateMetadata({
  params,
}: CharacterPageProps): Promise<Metadata> {
  const { id } = await params;
  const character = await getCharacter(id);
  return {
    title: `${character.name} - Rick & Morty`,
    description: `Información sobre ${character.name}`,
  };
}

const statusColors: Record<string, string> = {
  Alive: "bg-green-500",
  Dead: "bg-red-600",
  unknown: "bg-gray-500",
};

export default async function CharacterDetail({ params }: CharacterPageProps) {
  const { id } = await params;
  const character = await getCharacter(id);

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto bg-slate-900/80 backdrop-blur rounded-2xl shadow-2xl overflow-hidden border border-green-500/20">
        <div className="md:flex">
          <div className="md:w-1/2 relative aspect-square">
            <Image
              src={character.image}
              alt={character.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>

          <div className="md:w-1/2 p-8 text-white">
            <h1 className="text-4xl font-bold mb-2">{character.name}</h1>
            <span
              className={`${statusColors[character.status]} text-white inline-block px-4 py-1 rounded-full text-sm font-semibold mb-6`}
            >
              {character.status}
            </span>

            <div className="space-y-3">
              <div>
                <p className="text-green-400 text-sm font-semibold">Especie</p>
                <p className="text-lg">{character.species}</p>
              </div>

              {character.type && (
                <div>
                  <p className="text-green-400 text-sm font-semibold">Tipo</p>
                  <p className="text-lg">{character.type}</p>
                </div>
              )}

              <div>
                <p className="text-green-400 text-sm font-semibold">Género</p>
                <p className="text-lg">{character.gender}</p>
              </div>

              <div>
                <p className="text-green-400 text-sm font-semibold">Origen</p>
                <p className="text-lg">{character.origin.name}</p>
              </div>

              <div>
                <p className="text-green-400 text-sm font-semibold">
                  Última ubicación
                </p>
                <p className="text-lg">{character.location.name}</p>
              </div>

              <div>
                <p className="text-green-400 text-sm font-semibold">Episodios</p>
                <p className="text-lg">
                  Aparece en {character.episode.length} episodios
                </p>
              </div>

              <div>
                <p className="text-green-400 text-sm font-semibold">Creado</p>
                <p className="text-sm text-gray-300">
                  {new Date(character.created).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-black/40 border-t border-green-500/20">
          <Link
            href="/characters"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            ← Volver a personajes
          </Link>
        </div>
      </div>
    </div>
  );
}