// src/app/shortlist/page.tsx
"use client";

import { useMovieContext } from '@/context/MovieContext';
import MovieCard from '@/components/MovieCards/MovieCard';

export default function ShortlistPage() {
  const { shortlistedMovies } = useMovieContext();

  console.log('Rendering shortlist page with movies:', shortlistedMovies);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">My Shortlist</h1>
      <div className="flex flex-col gap-6">
        {shortlistedMovies.map(movie => (
          <div key={movie.id} className="w-full max-w-2xl mx-auto">
            <MovieCard posterPath={''} voteAverage={0} {...movie} />
          </div>
        ))}
      </div>
    </div>
  );
}