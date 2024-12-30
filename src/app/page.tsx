// src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import MovieCarousel from '@/components/MovieCarousel';
import MovieCardSkeleton from '@/components/MovieCardSkeleton';
import { fetchMovies } from '@/lib/tmdb';
import { Movie } from '@/types/movie';
import { useMovieContext } from '@/context/MovieContext';
import { Bookmark } from 'lucide-react';
import { NoiseBackground } from '@/components/NoiseBackground';

export default function Home() {
  // State management for movies and loading
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  
  // Get context for shortlist functionality
  const { addToShortlist, isMovieShortlisted, shortlistedMovies } = useMovieContext();

  // Load initial movies when component mounts
  useEffect(() => {
    loadInitialMovies();
  }, []);

  // Function to load initial set of movies
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

  // Function to load more movies when needed
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

  // Handler for when current movie changes in carousel
  const handleCurrentMovie = (movie: Movie) => {
    setCurrentMovie(movie);
    console.log('Current movie changed:', movie.title);
  };

  return (
    <main className="w-full h-screen flex flex-col bg-gray-950 overflow-hidden">
      <NoiseBackground 
      baseColor="#221F1F"
      noiseOpacity={0.02}
      noiseSize={240}
      className="min-h-screen flex flex-col flex-1">
        <h1 className="text-4xl font-bold text-gray-100 text-center mb-8 pt-8">
          Movie Discovery
        </h1>
        
        <div className="flex-1 relative">
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
              onCurrentMovieChange={handleCurrentMovie}
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