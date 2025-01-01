// hooks/useMoviesQuery.ts
import { useQuery } from '@tanstack/react-query';
import { fetchMoviesWithProviders } from '../lib/tmdb';

export const useMoviesQuery = (page = 1) => {
  return useQuery({
    queryKey: ['movies', page],
    queryFn: () => fetchMoviesWithProviders(page),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 30 * 60 * 1000,   // Changed from cacheTime to gcTime
  });
};