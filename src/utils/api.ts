import { Movie } from '@/types/TMDBMovie';

export const fetchMoviesWithProviders = async (page: number): Promise<Movie[]> => {
  const response = await fetch(`/api/movies?page=${page}`);
  if (!response.ok) {
    throw new Error('Failed to fetch movies');
  }
  return response.json();
}; 