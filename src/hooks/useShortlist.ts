import { useState, useEffect, useCallback } from 'react';
import { ShortlistStorage, ShortlistedMovie } from '@/lib/storage';
import { Movie } from '@/types/movie';

export const useShortlist = () => {
  const [movies, setMovies] = useState<ShortlistedMovie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const storage = ShortlistStorage.getInstance();

  useEffect(() => {
    setMovies(storage.getMovies());
  }, [storage]);

  const addMovie = useCallback((movie: Movie) => {
    try {
      storage.addMovie(movie);
      setMovies(storage.getMovies());
      setError(null);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to add movie');
      return false;
    }
  }, [storage]);

  const getCount = useCallback(() => {
    return storage.getCount();
  }, [storage]);

  return {
    movies,
    addMovie,
    getCount,
    error
  };
}; 