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
    
    const moviesWithProviders = await Promise.all(
      movieData.results.map(async (movie) => {
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