'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import MovieCarousel from './MovieCarousel';
import { Movie } from '@/types/TMDBMovie';
import { useMovieContext } from '@/context/MovieContext';
import { useCardDimensions } from '@/hooks/useCardDimensions';
import { matchesSelectedProviders } from '../../utils/providerMapping';
import { useFilters } from '@/context/FilterContext';

interface MovieCarouselWrapperProps {
  initialMovies: Movie[];
}

const MOVIES_PER_PAGE = 20; // Define constant for movies per page

const MovieCarouselWrapper = ({ initialMovies }: MovieCarouselWrapperProps) => {
  // State for current page and loading
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [visibleMovies, setVisibleMovies] = useState<Movie[]>([]);
  
  const { addToShortlist, shortlistedMovies, updateVisibleMovies } = useMovieContext();
  const cardDimensions = useCardDimensions();
  const { selectedFilter } = useFilters();

  // Memoize filtered movies to prevent unnecessary recalculations
  const filteredMovies = useMemo(() => {
    if (!selectedFilter) return visibleMovies;
  
    return visibleMovies.filter(movie =>
      matchesSelectedProviders(movie.providers?.flatrate, [selectedFilter])
    );
  }, [visibleMovies, selectedFilter]);

  // Load more movies handler with cleanup
  const loadMoreMovies = useCallback(async () => {
    if (isLoadingMore) return;
    
    try {
      setIsLoadingMore(true);
      console.log('Loading more movies for page:', currentPage + 1);
      
      const response = await fetch(`/api/movies?page=${currentPage + 1}`);
      const data = await response.json();
      
      setVisibleMovies(prev => {
        // Keep only last 2 pages worth of movies to limit memory usage
        const startIndex = Math.max(0, prev.length - MOVIES_PER_PAGE);
        return [...prev.slice(startIndex), ...data.movies];
      });
      
      setCurrentPage(prev => prev + 1);
    } catch (error) {
      console.error('Error loading more movies:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [currentPage, isLoadingMore]);

  // Initialize visible movies
  useEffect(() => {
    setVisibleMovies(initialMovies);
  }, [initialMovies]);

  // Log current state for debugging
  useEffect(() => {
    console.log('Current visible movies count:', visibleMovies.length);
    console.log('Current filtered movies count:', filteredMovies.length);
  }, [visibleMovies.length, filteredMovies.length]);

  useEffect(() => {
    updateVisibleMovies(selectedFilter);
  }, [selectedFilter, updateVisibleMovies]);

  return (
    <div className="flex-1 relative">
      <MovieCarousel
        initialMovies={filteredMovies}
        onLoadMore={loadMoreMovies}
        isLoading={isLoadingMore}
        onCurrentMovieChange={setCurrentMovie}
      />
      {currentMovie && (
        <div className="w-full flex flex-row justify-center items-center mt-2 px-5">
          <div 
            className="flex items-center justify-center gap-2 p-1 rounded-t-md bg-black/10 backdrop-blur-sm shadow-[0_0px_12px_0px_rgba(0,0,0,0.5)]"
            style={{ width: `${cardDimensions.cardWidth}px` }}
          >
            <button
              onClick={() => addToShortlist(currentMovie)}
              className="p-2 rounded-full text-white/50 hover:text-white font-handwritten text-sm w-auto"
            >
              <span>{shortlistedMovies.length} Shortlisted</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieCarouselWrapper;