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

const MovieCarouselWrapper = ({ initialMovies }: MovieCarouselWrapperProps) => {
  // State for current page and loading
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [visibleMovies, setVisibleMovies] = useState<Movie[]>([]);
  const [movieCache, setMovieCache] = useState<Record<string, Movie[]>>({});
  
  const { addToShortlist, shortlistedMovies, updateVisibleMovies } = useMovieContext();
  const cardDimensions = useCardDimensions();
  const { selectedFilter } = useFilters();

  // Initialize movie cache with all movies
  useEffect(() => {
    setMovieCache(prevCache => ({
      ...prevCache,
      'all': initialMovies,
    }));
    setVisibleMovies(initialMovies);
  }, [initialMovies]);

  // Memoize filtered movies with cache
  const filteredMovies = useMemo(() => {
    if (!selectedFilter) return movieCache['all'] || [];

    if (movieCache[selectedFilter]) {
      return movieCache[selectedFilter];
    }

    const filtered = (movieCache['all'] || []).filter(movie =>
      matchesSelectedProviders(movie.providers?.flatrate, [selectedFilter])
    );

    setMovieCache(prevCache => ({
      ...prevCache,
      [selectedFilter]: filtered,
    }));

    return filtered;
  }, [selectedFilter, movieCache]);

  // Load more movies handler with cleanup
  const loadMoreMovies = useCallback(async () => {
    if (isLoadingMore) return;
    
    try {
      setIsLoadingMore(true);
      console.log('Loading more movies for page:', currentPage + 1);
      
      const response = await fetch(`/api/movies?page=${currentPage + 1}`);
      const data = await response.json();
      
      setMovieCache(prevCache => {
        const updatedCache = { ...prevCache };
        
        // Update 'all' cache with new movies
        updatedCache['all'] = [...(prevCache['all'] || []), ...data.movies];
        
        // Update filtered cache if a filter is selected
        if (selectedFilter) {
          const newFilteredMovies = data.movies.filter(movie =>
            matchesSelectedProviders(movie.providers?.flatrate, [selectedFilter])
          );
          updatedCache[selectedFilter] = [...(prevCache[selectedFilter] || []), ...newFilteredMovies];
        }
        
        return updatedCache;
      });
      
      setCurrentPage(prev => prev + 1);
    } catch (error) {
      console.error('Error loading more movies:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [currentPage, isLoadingMore, selectedFilter]);

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