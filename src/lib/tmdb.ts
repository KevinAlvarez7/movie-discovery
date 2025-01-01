import { Movie } from '@/types/TMDBMovie';
import { matchesSelectedProviders } from '@/utils/providerMapping';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const API_BASE_URL = 'https://api.themoviedb.org/3';

interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  vote_average: number;
}

export async function fetchMovies(page: number = 1): Promise<Movie[]> {
  if (!API_KEY) {
    throw new Error('TMDB API key is not set. Please check your environment variables.');
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&page=${page}`,
      { next: { revalidate: 3600 } } // Revalidate every hour
    );

    if (!response.ok) {
      throw new Error(`TMDB API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return data.results.map((movie: TMDBMovie) => ({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      overview: movie.overview,
      vote_average: movie.vote_average,
    }));
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw new Error('Failed to fetch movies. Please try again later.');
  }
}

// src/lib/tmdb.ts

export async function fetchMoviesWithProviders(page = 1, selectedProviders: string[] = []) {
  try {
    // Fetch a batch of movies
    const moviesResponse = await fetch(
      `/api/movies?page=${page}`
    );
    const { movies } = await moviesResponse.json();

    // Fetch providers for all movies in parallel
    const moviesWithProviders = await Promise.all(
      movies.map(async (movie: Movie) => {
        try {
          const providersResponse = await fetch(`/api/providers/${movie.id}`);
          const { providers } = await providersResponse.json();
          return {
            ...movie,
            providers: { flatrate: providers?.flatrate || [] }
          };
        } catch (error) {
          console.error(`Failed to fetch providers for ${movie.title}:`, error);
          return { ...movie, providers: { flatrate: [] } };
        }
      })
    );

    // Filter movies based on selected providers
    const filteredMovies = selectedProviders.length === 0 
      ? moviesWithProviders 
      : moviesWithProviders.filter(movie => 
          matchesSelectedProviders(movie.providers, selectedProviders)
        );

    console.log(`Filtered ${filteredMovies.length} movies from ${movies.length} total`);
    return filteredMovies;
  } catch (error) {
    console.error('Error fetching movies with providers:', error);
    throw error;
  }
}

