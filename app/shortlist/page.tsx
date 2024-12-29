"use client";

import { useShortlist } from '@/hooks/useShortlist';
import MovieCard from '@/components/MovieCard';
import { useRouter } from 'next/navigation';

export default function ShortlistPage() {
  const { movies } = useShortlist();
  const router = useRouter();

  return (
    <main className="w-full min-h-screen bg-gray-950 p-4">
      <div className="container mx-auto">
        <button 
          onClick={() => router.back()}
          className="text-white mb-4"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-white mb-8">My Shortlist</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {movies.map((movie) => (
            <MovieCard key={movie.id} {...movie} />
          ))}
        </div>
      </div>
    </main>
  );
} 