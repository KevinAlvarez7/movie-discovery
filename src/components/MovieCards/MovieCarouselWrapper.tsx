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
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [movieCache, setMovieCache] = useState<Record<string, Movie[]>>({});
  const { selectedFilter } = useFilters();

  // Initialize movie cache with initial movies
  useEffect(() => {
    setMovieCache(prevCache => ({
      ...prevCache,
      'all': initialMovies,
    }));
  }, [initialMovies]);

  // Filter movies without loading more
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

  const loadMoreMovies = useCallback(async () => {
    if (isLoadingMore) return;
    try {
      setIsLoadingMore(true);
      const newMovies = await fetchMoviesWithProviders(currentPage + 1);
      
      // Update cache for all movies
      setMovieCache(prevCache => ({
        ...prevCache,
        'all': [...(prevCache['all'] || []), ...newMovies],
      }));
      
      // Update current filter if exists
      if (selectedFilter) {
        const filteredNewMovies = newMovies.filter(movie =>
          matchesSelectedProviders(movie.providers?.flatrate, [selectedFilter])
        );
        setMovieCache(prevCache => ({
          ...prevCache,
          [selectedFilter]: [...(prevCache[selectedFilter] || []), ...filteredNewMovies],
        }));
      }
      
      setCurrentPage(prev => prev + 1);
    } catch (e) {
      console.error('Error loading more movies:', e);
    } finally {
      setIsLoadingMore(false);
    }
  }, [currentPage, isLoadingMore, selectedFilter]);

  return (
    <MovieCarousel
      initialMovies={filteredMovies}
      onLoadMore={loadMoreMovies}
      isLoading={isLoadingMore}
    />
  );
};

export default MovieCarouselWrapper;