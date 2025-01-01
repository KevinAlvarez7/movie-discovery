import { useCallback, useEffect, useState, useTransition } from 'react';
import { fetchMoviesWithProviders } from '../lib/tmdb';
import { matchesSelectedProviders } from '../utils/providerMapping';

export function useMovies(filters: Set<string>) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const fetchMovies = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchMoviesWithProviders();
      startTransition(() => {
        const filtered = data.filter(movie => 
          matchesSelectedProviders(movie.providers?.flatrate, Array.from(filters))
        );
        setMovies(filtered);
      });
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  return { movies, isLoading: isLoading || isPending };
} 