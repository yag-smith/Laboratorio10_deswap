import { ReactNode } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { IoPlanet } from "react-icons/io5";

export const metadata: Metadata = {
  title: "Rick and Morty - Personajes",
  description: "Explora el multiverso de Rick and Morty",
};

interface CharactersLayoutProps {
  children: ReactNode;
}

export default function CharactersLayout({ children }: CharactersLayoutProps) {
  return (
    <div className="min-h-screen bg-linear-to-br from-green-900 via-emerald-800 to-cyan-900">
      <nav className="bg-black/40 backdrop-blur-sm sticky top-0 z-50 border-b border-green-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/characters"
            className="text-white text-2xl font-bold hover:text-green-400 transition flex items-center gap-2"
          >
            <IoPlanet size={32} className="text-green-400" />
            Rick & Morty
          </Link>
          <div className="flex gap-6">
            <Link
              href="/characters"
              className="text-white/80 hover:text-green-400 transition font-semibold"
            >
              Personajes
            </Link>
            <Link
              href="/characters/search"
              className="text-white/80 hover:text-green-400 transition font-semibold"
            >
              Búsqueda
            </Link>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}