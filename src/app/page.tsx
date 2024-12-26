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
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
          Movie Discovery
        </h1>
        
        <div className="max-w-3xl mx-auto mb-8">
          <FilterSection />
        </div>

        <Suspense 
          fallback={
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
            </div>
          }
        >
          {error ? (
            <div className="text-center py-8">
              <div className="text-red-500 text-lg font-medium mb-2">Error</div>
              <div className="text-gray-600">{error}</div>
            </div>
          ) : (
            <div className="mt-8">
              <MovieCarousel initialMovies={movies} />
            </div>
          )}
        </Suspense>
      </div>
    </main>
  );
}

  