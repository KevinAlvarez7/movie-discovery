// src/app/api/movies/route.ts

import { TMDBResponse } from '@/types/TMDBMovie';
import { NextResponse } from 'next/server';

const providerIds = [8, 337, 9]; // Netflix, Disney, Prime

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page')) || 1;
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  
  try {
    console.log(`Fetching movies for page ${page}`);
    
    const movieResponse = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_watch_providers=${providerIds.join('|')}&watch_region=US&page=${page}`
    );
    const movieData: TMDBResponse = await movieResponse.json();
    
    const moviesWithProviders = await Promise.all(
      movieData.results.map(async (movie) => {
        const providerResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}/watch/providers?api_key=${apiKey}`
        );
        const providerData = await providerResponse.json();
        
        const usProviders = providerData.results?.US;
        
        return {
          ...movie,
          providers: {
            flatrate: usProviders?.flatrate || []
          }
        };
      })
    );
    
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