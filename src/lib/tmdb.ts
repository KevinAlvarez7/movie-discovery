import { Movie } from '@/types/TMDBMovie';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const API_BASE_URL = 'https://api.themoviedb.org/3';

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
    return data.results.map((movie: Movie) => ({
      id: movie.id,
      title: movie.title,
      posterPath: movie.poster_path,
      overview: movie.overview,
      voteAverage: movie.vote_average,
    }));
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw new Error('Failed to fetch movies. Please try again later.');
  }
}

export async function getWatchProviders(movieId: number, region: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/movie/${movieId}/watch/providers?api_key=${API_KEY}`
    );
    const data = await response.json();
    return data.results[region]?.flatrate || [];
  } catch (error) {
    console.error('Error fetching watch providers:', error);
    return [];
  }
}

export async function getMoviesWithProviders(page = 1) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/discover/movie?api_key=${API_KEY}&page=${page}`
    );
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
}



