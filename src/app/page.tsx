'use client';

import MovieCarousel from '@/components/MovieCarousel';
import MovieCardSkeleton from '@/components/MovieCardSkeleton';
import { fetchMovies } from '@/lib/tmdb';
import { Movie } from '@/types/movie';
import { useState, useEffect } from 'react';

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInitialMovies();
  }, []);

  const loadInitialMovies = async () => {
    try {
      setIsLoading(true);
      const initialMovies = await fetchMovies();
      setMovies(initialMovies);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Error in Home component:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = async () => {
    try {
      const nextPage = page + 1;
      const newMovies = await fetchMovies(nextPage);
      setMovies(prev => [...prev, ...newMovies]);
      setPage(nextPage);
    } catch (e) {
      console.error('Error loading more movies:', e);
    }
  };

  return (
    <main className="w-full h-screen flex bg-gray-950 overflow-hidden">
      <div className="flex flex-col w-full py-8 overflow-hidden">
        <h1 className="text-4xl font-bold text-gray-100 text-center mb-8">
          Movie Discovery
        </h1>
        {/* <div className="max-w-3xl mx-auto justify-center center-algin mb-8">
          <FilterSection />
        </div> */}
        <div className="flex-1 mt-8 overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center">
              <MovieCardSkeleton />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center p-4">{error}</div>
          ) : (
            <MovieCarousel 
              initialMovies={movies} 
              onLoadMore={loadMore} 
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </main>
  );
}

  