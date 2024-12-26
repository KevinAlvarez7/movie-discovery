import { Suspense } from 'react';
import MovieCarousel from '@/components/MovieCarousel';
import FilterSection from '@/components/FilterSection';
import { fetchMovies } from '@/lib/tmdb';
import { Movie } from '@/types/movie';

export default async function Home() {
  let movies: Movie[] = [];
  let error = null;

  try {
    movies = await fetchMovies();
  } catch (e) {
    error = e instanceof Error ? e.message : 'An unknown error occurred';
    console.error('Error in Home component:', error);
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Movie Discovery</h1>
      <FilterSection />
      <Suspense fallback={<div>Loading movies...</div>}>
        {error ? (
          <div className="text-red-500 text-center py-4">
            {error}
          </div>
        ) : (
          <MovieCarousel initialMovies={movies} />
        )}
      </Suspense>
    </main>
  );
}

  