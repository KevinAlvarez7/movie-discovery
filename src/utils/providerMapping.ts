// src/app/api/movies/route.ts
import { TMDBResponse } from '@/types/TMDBMovie';
import { NextResponse } from 'next/server';

// First, let's add better logging
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    
    try {
      console.log(`Fetching movies for page ${page}`);
      
      const movieResponse = await fetch(
        `https://api.themoviedb.org/3/movie/popular?page=${page}&api_key=${apiKey}`
      );
      const movieData: TMDBResponse = await movieResponse.json();
      
      // Let's fetch just 5 movies first to test
      const firstFiveMovies = movieData.results.slice(0, 5);
      
      const moviesWithProviders = await Promise.all(
        firstFiveMovies.map(async (movie) => {
          console.log(`Fetching providers for movie: ${movie.title}`);
          
          const providerResponse = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}/watch/providers?api_key=${apiKey}`
          );
          const providerData = await providerResponse.json();
          
          // Log provider data
          console.log(`Provider data for ${movie.title}:`, providerData?.results?.US);
          
          const usProviders = providerData.results?.US;
          
          return {
            ...movie,
            providers: {
              flatrate: usProviders?.flatrate || []
            }
          };
        })
      );
  
      console.log('First movie with providers:', moviesWithProviders[0]);
      
      return NextResponse.json({ 
        movies: moviesWithProviders, 
        total_pages: movieData.total_pages 
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      return NextResponse.json(
        { error: 'Failed to fetch movies' }, 
        { status: 500 }
      );
    }
  }

type Provider = {
  provider_id: number;
  provider_name: string;
  logo_path: string;
};

const PROVIDER_IDS = {
  'Netflix': 8,
  'Disney': 337,
  'Prime': 9
};

export const matchesSelectedProviders = (
  providers: Provider[] = [], 
  selectedProviders: string[] = []
): boolean => {
  if (selectedProviders.length === 0) return true;
  
  const providerIds = providers.map(p => p.provider_id);
  return selectedProviders.some(name => 
    PROVIDER_IDS[name as keyof typeof PROVIDER_IDS] && 
    providerIds.includes(PROVIDER_IDS[name as keyof typeof PROVIDER_IDS])
  );
};