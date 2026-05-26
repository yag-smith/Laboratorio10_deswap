"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PokemonError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Error capturado:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md text-center">
        <h1 className="text-5xl font-bold text-red-600 mb-4">¡Ups!</h1>
        <p className="text-gray-700 text-lg mb-2">Algo salió mal en el Pokédex</p>
        <p className="text-gray-500 text-sm mb-6">{error.message}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition cursor-pointer"
          >
            Reintentar
          </button>
          <Link
            href="/pokemon"
            className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            Volver al Pokédex
          </Link>
        </div>
      </div>
    </div>
  );
}
