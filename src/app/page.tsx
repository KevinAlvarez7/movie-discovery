'use client';

import { useState, useEffect } from 'react';
import MovieCarouselWrapper from '@/components/MovieCards/MovieCarouselWrapper';
import MovieCardSkeleton from '@/components/MovieCards/MovieCardSkeleton';
import { fetchMoviesWithProviders } from '@/lib/tmdb';
import { Movie } from '../types/TMDBMovie';
// In src/app/page.tsx
import { NoiseBackground } from '@/components/UI/NoiseBackground';  // Changed from @/components/ui/NoiseBackground
import StreamingFilters from '@/components/UI/StreamingFilters';    // Changed from @/components/ui/StreamingFilters
import { useMovieCache } from '../hooks/useMovieCache';
import { useFilters } from '../context/FilterContext';

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  
  const { initializeCache, shouldFetchMore } = useMovieCache();
  const { selectedFilters } = useFilters();

  // Initial fetch of movies
  useEffect(() => {
    async function fetchInitialMovies() {
      try {
        const initialMovies = await fetchMoviesWithProviders();
        setMovies(initialMovies);
        await initializeCache(initialMovies);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'An unknown error occurred');
      } finally {
        setInitialLoading(false);
      }
    }
    fetchInitialMovies();
  }, [initializeCache]);

  // Handle loading more movies when needed
  const loadMoreMovies = async () => {
    if (isLoadingMore || !shouldFetchMore(selectedFilters)) return;
    try {
      setIsLoadingMore(true);
      const newMovies = await fetchMoviesWithProviders();
      await initializeCache(newMovies);
    } catch (e) {
      console.error('Error loading more movies:', e);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <main className="w-full h-screen flex flex-col bg-gray-950 overflow-hidden">
      <NoiseBackground 
        noiseSize={20}
        noiseOpacity={0.0}
        baseColor="#191919"
        className="min-h-screen flex flex-col flex-1">
        <StreamingFilters/>      
        <div className="h-full flex flex-col justify-center items-center relative">
          {initialLoading ? (
            <MovieCardSkeleton />
          ) : error ? (
            <div className="text-red-500 text-center p-4">{error}</div>
          ) : (
            <MovieCarouselWrapper 
              initialMovies={movies}
              onLoadMore={loadMoreMovies}
              isLoading={isLoadingMore}
              onCurrentMovieChange={(movie: Movie | null) => setCurrentMovie(movie)}
            />
          )}
        </div>
      </NoiseBackground>
    </main>
  );
}