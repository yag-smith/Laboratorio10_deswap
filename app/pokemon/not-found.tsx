import Link from "next/link";
import { IoSearchOutline } from "react-icons/io5";

export default function PokemonNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md text-center">
        <IoSearchOutline size={80} className="text-purple-300 mx-auto mb-4" />
        <h1 className="text-5xl font-bold text-purple-700 mb-3">404</h1>
        <p className="text-gray-700 text-xl mb-2">Pokémon no encontrado</p>
        <p className="text-gray-500 text-sm mb-6">
          El Pokémon que buscas no existe en este Pokédex
        </p>
        <Link
          href="/pokemon"
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition"
        >
          Volver al Pokédex
        </Link>
      </div>
    </div>
  );
}
