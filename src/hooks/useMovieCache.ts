import { Movie } from '@/types/TMDBMovie';
import { useCallback, useState } from 'react';
import { matchesSelectedProviders } from '@/utils/providerMapping';

export const VISIBLE_COUNT = 10;
export const CACHE_SIZE = 40;
export const LOAD_THRESHOLD = 5; // Show next batch after 5th card
export const FETCH_THRESHOLD = 35; // Fetch more when reaching 35th card

interface CacheState {
  allMovies: Movie[];        // All unfiltered movies
  visibleMovies: Movie[];    // Currently visible movies (10)
  filteredMovies: {          // Pre-filtered results
    [key: string]: Movie[];  // key = filter combination (e.g., "Netflix,Prime")
  };
  currentIndex: number;
}

const getAllCombinations = (arr: string[]): string[][] => {
  const result: string[][] = [];
  for (let i = 1; i <= arr.length; i++) {
    const combo = arr.reduce((acc: string[][], curr, idx) => {
      if (i === 1) return [...acc, [curr]];
      acc.forEach(prevCombo => {
        if (prevCombo.length === i - 1 && idx > arr.indexOf(prevCombo[prevCombo.length - 1]))
          result.push([...prevCombo, curr]);
      });
      return acc;
    }, []);
    if (i === 1) result.push(...combo);
  }
  return result;
};

export function useMovieCache() {
  const [cacheState, setCacheState] = useState<CacheState>({
    allMovies: [],
    visibleMovies: [],
    filteredMovies: {},
    currentIndex: 0
  });

  const initializeCache = useCallback(async (movies: Movie[]) => {
    console.log('Initializing cache with movies:', movies);
    
    if (!movies?.length) {
      console.error('No movies provided to cache');
      return;
    }

    // Initialize main cache with both visible and cached movies
    setCacheState(prev => ({
      ...prev,
      allMovies: movies.slice(0, VISIBLE_COUNT + CACHE_SIZE),
      visibleMovies: movies.slice(0, VISIBLE_COUNT)
    }));

    // Pre-calculate all filter combinations
    const providers = ['Netflix', 'Disney', 'Prime'];
    const combinations = getAllCombinations(providers);
    
    const filteredResults: { [key: string]: Movie[] } = {};
    combinations.forEach(combo => {
      const key = combo.sort().join(',');
      const filtered = movies.filter(movie => 
        matchesSelectedProviders(movie.providers?.flatrate || [], combo)
      );
      filteredResults[key] = filtered;
    });

    setCacheState(prev => ({
      ...prev,
      filteredMovies: filteredResults
    }));
  }, []);

  const updateCurrentIndex = useCallback((newIndex: number) => {
    setCacheState(prev => ({
      ...prev,
      currentIndex: newIndex
    }));
  }, []);

  const getFilteredMovies = useCallback((filters: Set<string>) => {
    const key = Array.from(filters).sort().join(',');
    
    if (filters.size === 0) {
      return cacheState.visibleMovies;
    }
    
    const filtered = cacheState.filteredMovies[key] || [];
    return filtered.slice(0, VISIBLE_COUNT);
  }, [cacheState.visibleMovies, cacheState.filteredMovies]);

  const updateVisibleMovies = useCallback((filters: Set<string>) => {
    const key = Array.from(filters).sort().join(',');
    const sourceMovies = filters.size === 0 ? cacheState.allMovies : cacheState.filteredMovies[key] || [];
    
    // Keep the current index centered and extend the visible range around it
    const startIdx = Math.max(0, cacheState.currentIndex - Math.floor(VISIBLE_COUNT / 2));
    const endIdx = startIdx + VISIBLE_COUNT;
    const visibleMovies = sourceMovies.slice(startIdx, endIdx);

    setCacheState(prev => ({
      ...prev,
      visibleMovies
    }));
  }, [cacheState.allMovies, cacheState.filteredMovies, cacheState.currentIndex]);

  const shouldFetchMore = useCallback((filters: Set<string>) => {
    const key = Array.from(filters).sort().join(',');
    const sourceMovies = filters.size === 0 ? cacheState.allMovies : cacheState.filteredMovies[key] || [];
    return cacheState.currentIndex >= sourceMovies.length - FETCH_THRESHOLD;
  }, [cacheState.allMovies, cacheState.filteredMovies, cacheState.currentIndex]);

  return {
    visibleMovies: cacheState.visibleMovies,
    initializeCache,
    getFilteredMovies,
    shouldFetchMore,
    updateCurrentIndex,
    updateVisibleMovies
  };
} 