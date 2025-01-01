'use client';

import { useState, useEffect, useMemo } from 'react';
import MovieCarousel from '../components/MovieCards/MovieCarousel';
import MovieCardSkeleton from '../components/MovieCards/MovieCardSkeleton';
import { fetchMoviesWithProviders } from '../lib/tmdb';
import { Movie } from '../types/TMDBMovie';
// import { useMovieContext } from '../context/MovieContext';
// In src/app/page.tsx
import { NoiseBackground } from '../components/UI/NoiseBackground';  // Changed from @/components/ui/NoiseBackground
import StreamingFilters from '../components/UI/StreamingFilters';    // Changed from @/components/ui/StreamingFilters
// import { useCardDimensions } from '../hooks/useCardDimensions';
import { useFilters } from '../context/FilterContext';
import { matchesSelectedProviders } from '../utils/providerMapping';

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  // const [setCurrentMovie] = useState<Movie | null>(null);
  
  // const { addToShortlist, shortlistedMovies } = useMovieContext();
  // const cardDimensions = useCardDimensions();

  const { selectedFilter } = useFilters();
  
  // Create filtered movies list
 // In page.tsx
const filteredMovies = useMemo(() => {
  console.log('Filtering movies:', {
    totalMovies: movies.length,
    selectedFilter
  });
  
  if (!selectedFilter) return movies; // Return all movies if no filter
  
  return movies.filter(movie => {
    const providers = movie.providers?.flatrate;
    return matchesSelectedProviders(providers, [selectedFilter]);
  });
}, [movies, selectedFilter]);

  // Add an effect to log filter changes
  useEffect(() => {
    console.log('Selected filters changed:', selectedFilter);
  }, [selectedFilter]);

  useEffect(() => {
    async function fetchInitialMovies() {
      try {
        const initialMovies = await fetchMoviesWithProviders();
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
      const newMovies = await fetchMoviesWithProviders(movies.length / 20 + 1);
      setMovies(prev => [...prev, ...newMovies]);
    } catch (e) {
      console.error('Error loading more movies:', e);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <main className="w-full h-[100dvh] flex flex-col bg-gray-950 overflow-hidden">
      <NoiseBackground 
        baseColor="#221F1F"
        noiseOpacity={0.02}
        noiseSize={240}
        className="h-full flex flex-col flex-1">
          <div className="w-full flex flex-col items-center mt-10 justify-center gap-4">
            <h3 className="text-[#f1fafa] text-lg font-handwritten">Popular movies streaming on:</h3>
            <StreamingFilters/>  
          </div>
    
        <div className="h-full flex flex-col justify-center items-center relative">
          {initialLoading ? ( // Only show skeleton on initial load
            <div className="flex justify-center">
              <MovieCardSkeleton />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center p-4">{error}</div>
          ) : (
            <MovieCarousel 
            initialMovies={filteredMovies} // Changed from movies to filteredMovies
            onLoadMore={loadMoreMovies} 
            isLoading={isLoadingMore}
            // onCurrentMovieChange={setCurrentMovie}
          />
          )}
        </div>
        {/* Shortlist controls - only shown when a movie is selected */}
        {/* {currentMovie && (
          <>
            <div className="w-full flex flex-row justify-center items-center mt-2 px-5">
              <div 
                className={`flex items-center justify-center gap-2 p-1 rounded-t-md bg-black/10 backdrop-blur-sm shadow-[0_0px_12px_0px_rgba(0,0,0,0.5)]`}
                style={{ width: `${cardDimensions.cardWidth}px` }}
              >
                <div className="w-full flex flex-row items-center justify-center gap-2">
                  <button
                    onClick={() => addToShortlist(currentMovie)}
                    className="p-2 rounded-full text-white/50 hover:text-white font-handwritten text-sm w-auto"
                  >
                    <span> {shortlistedMovies.length} Shortlisted</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )} */}
      </NoiseBackground>
    </main>
  );
}