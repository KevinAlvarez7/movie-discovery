'use client';

import { useState, useEffect } from 'react';
import MovieCarousel from '@/components/MovieCards/MovieCarousel';
import MovieCardSkeleton from '@/components/MovieCards/MovieCardSkeleton';
import { fetchMovies } from '@/lib/tmdb';
import { Movie } from '@/types/TMDBMovie';
import { useMovieContext } from '@/context/MovieContext';
import { Bookmark } from 'lucide-react';
import { NoiseBackground } from '@/components/ui/NoiseBackground'
import StreamingFilterWithProvider from '@/components/ui/FilterContainer';

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  
  const { addToShortlist, isMovieShortlisted, shortlistedMovies } = useMovieContext();

  useEffect(() => {
    async function fetchInitialMovies() {
      try {
        const initialMovies = await fetchMovies();
        setMovies(initialMovies);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'An unknown error occurred');
      } finally {
        setInitialLoading(false);
      }
    }
    fetchInitialMovies();
  }, []);

  const loadMoreMovies = async () => {
    if (isLoadingMore) return;
    try {
      setIsLoadingMore(true);
      const newMovies = await fetchMovies(movies.length / 20 + 1);
      setMovies(prev => [...prev, ...newMovies]);
    } catch (e) {
      console.error('Error loading more movies:', e);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <main className="w-full h-screen flex flex-col bg-gray-950 overflow-hidden">
      <NoiseBackground 
        baseColor="#221F1F"
        noiseOpacity={0.02}
        noiseSize={240}
        className="min-h-screen flex flex-col flex-1">
        <StreamingFilterWithProvider />
        <div className="flex-1 relative">
          {initialLoading ? ( // Only show skeleton on initial load
            <div className="flex justify-center">
              <MovieCardSkeleton />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center p-4">{error}</div>
          ) : (
            <MovieCarousel 
            initialMovies={movies} 
            onLoadMore={loadMoreMovies} 
            isLoading={isLoadingMore}
            onCurrentMovieChange={setCurrentMovie}
          />
          )}
        </div>

        {/* Shortlist controls - only shown when a movie is selected */}
        {currentMovie && (
          <div className="w-full flex justify-center items-center gap-4 p-4 bg-gray-900/50 backdrop-blur-sm">
            <div className="relative">
              <button
                onClick={() => addToShortlist(currentMovie)}
                className="p-2 rounded-full hover:bg-white/20 text-white"
              >
                <Bookmark 
                  className={`w-6 h-6 ${isMovieShortlisted(currentMovie.id) ? 'fill-current' : ''}`}
                />
                {shortlistedMovies.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {shortlistedMovies.length}
                  </span>
                )}
              </button>
            </div>
            <button
              onClick={() => addToShortlist(currentMovie)}
              className="px-6 py-2 rounded-full bg-white/25 hover:bg-white/40 backdrop-blur-[8px] transition-colors text-white"
            >
              {isMovieShortlisted(currentMovie.id) ? 'Shortlisted' : 'Shortlist'}
            </button>
          </div>
        )}
      </NoiseBackground>
    </main>
  );
}