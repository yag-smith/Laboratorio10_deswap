"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { IoSearch } from "react-icons/io5";
import { RickMortyCharacter, RickMortyResponse } from "@/types/rickandmorty";

const statusColors: Record<string, string> = {
  Alive: "bg-green-500",
  Dead: "bg-red-500",
  unknown: "bg-gray-500",
};

export default function CharacterSearch() {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [gender, setGender] = useState("");

  const [results, setResults] = useState<RickMortyCharacter[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // CSR: useEffect dispara la búsqueda al cambiar cualquier filtro (con debounce 400ms)
  useEffect(() => {
    if (!name && !status && !type && !gender) {
      setResults([]);
      setError(null);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (name) params.append("name", name);
      if (status) params.append("status", status);
      if (type) params.append("type", type);
      if (gender) params.append("gender", gender);

      try {
        const res = await fetch(
          `https://rickandmortyapi.com/api/character/?${params.toString()}`
        );
        if (res.status === 404) {
          setResults([]);
          setError("No se encontraron personajes con esos filtros");
          return;
        }
        if (!res.ok) throw new Error("Error en la búsqueda");
        const data: RickMortyResponse = await res.json();
        setResults(data.results);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [name, status, type, gender]);

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
          Búsqueda (CSR)
        </h1>
        <p className="text-green-300 mb-8">
          Filtra personajes en tiempo real con useState y useEffect
        </p>

        <div className="bg-slate-900/80 backdrop-blur rounded-xl p-6 mb-8 border border-green-500/20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-green-400 text-sm font-semibold mb-2">
                Nombre
              </label>
              <div className="relative">
                <IoSearch
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rick, Morty..."
                  className="w-full pl-10 pr-3 py-2 bg-black/40 border border-green-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-green-400 text-sm font-semibold mb-2">
                Estado
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 bg-black/40 border border-green-500/30 rounded-lg text-white focus:outline-none focus:border-green-400"
              >
                <option value="">Todos</option>
                <option value="alive">Alive</option>
                <option value="dead">Dead</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>

            <div>
              <label className="block text-green-400 text-sm font-semibold mb-2">
                Tipo
              </label>
              <input
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="Genetic experiment..."
                className="w-full px-3 py-2 bg-black/40 border border-green-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-400"
              />
            </div>

            <div>
              <label className="block text-green-400 text-sm font-semibold mb-2">
                Género
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 bg-black/40 border border-green-500/30 rounded-lg text-white focus:outline-none focus:border-green-400"
              >
                <option value="">Todos</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="genderless">Genderless</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
          </div>
        </div>

        {loading && (
          <p className="text-green-300 text-center">Buscando...</p>
        )}
        {error && (
          <p className="text-red-400 text-center bg-red-900/30 p-4 rounded-lg">
            {error}
          </p>
        )}
        {!loading &&
          !error &&
          results.length === 0 &&
          (name || status || type || gender) && (
            <p className="text-gray-400 text-center">Sin resultados</p>
          )}

        {results.length > 0 && (
          <>
            <p className="text-green-300 mb-4">
              {results.length} personajes encontrados
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {results.map((character) => (
                <Link
                  key={character.id}
                  href={`/characters/${character.id}`}
                  className="transform transition hover:scale-105"
                >
                  <div className="bg-slate-900/80 backdrop-blur rounded-xl shadow-lg overflow-hidden hover:shadow-green-400/30 border border-green-500/10">
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
          </>
        )}
      </div>
    </div>
  );
}