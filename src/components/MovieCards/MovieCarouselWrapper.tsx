'use client';

import { useEffect, useMemo } from 'react';
import MovieCarousel from './MovieCarousel';
import { useFilters } from '../../context/FilterContext';
import { Movie } from '../../types/TMDBMovie';
import { useMovieCache } from '../../hooks/useMovieCache';
import MovieCardSkeleton from './MovieCardSkeleton';

interface MovieCarouselWrapperProps {
  initialMovies: Movie[];
  onLoadMore: () => Promise<void>;
  isLoading: boolean;
  onCurrentMovieChange: (movie: Movie | null) => void;
}

export default function MovieCarouselWrapper({ 
  initialMovies, 
  onLoadMore, 
  isLoading,
  onCurrentMovieChange 
}: MovieCarouselWrapperProps) {
  const { visibleMovies, initializeCache, getFilteredMovies, shouldFetchMore, updateCurrentIndex, updateVisibleMovies } = useMovieCache();
  const { selectedFilters } = useFilters();

  useEffect(() => {
    console.log('MovieCarouselWrapper received initialMovies:', initialMovies);
    if (initialMovies?.length > 0) {
      initializeCache(initialMovies);
    }
  }, [initialMovies, initializeCache]);

  useEffect(() => {
    updateVisibleMovies(selectedFilters);
  }, [selectedFilters, updateVisibleMovies]);

  const currentMovies = useMemo(() => {
    if (selectedFilters.size === 0) {
      console.log('No filters, using visibleMovies:', visibleMovies);
      return visibleMovies;
    }
    const filtered = getFilteredMovies(selectedFilters);
    console.log('Using filtered movies:', filtered);
    return filtered;
  }, [selectedFilters, getFilteredMovies, visibleMovies]);

  useEffect(() => {
    if (currentMovies?.length > 0) {
      updateVisibleMovies(selectedFilters);
    }
  }, [selectedFilters, currentMovies?.length, updateVisibleMovies]);

  if (!currentMovies?.length) {
    console.log('No current movies available, showing skeleton');
    return <MovieCardSkeleton />;
  }

  const handleMovieChange = (movie: Movie) => {
    const index = currentMovies.findIndex(m => m.id === movie.id);
    updateCurrentIndex(index);
    if (shouldFetchMore(selectedFilters)) {
      onLoadMore();
    }
    onCurrentMovieChange?.(movie);
  };

  return (
    <MovieCarousel
      initialMovies={currentMovies}
      onLoadMore={onLoadMore}
      isLoading={isLoading}
      onCurrentMovieChange={handleMovieChange}
    />
  );
}