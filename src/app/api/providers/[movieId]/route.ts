// src/app/api/providers/[movieId]/route.ts

import { NextResponse } from 'next/server';
import { WatchProviders } from '@/types/TMDBProvider';

export async function GET(
  request: Request,
  { params }: { params: { movieId: string } }
) {
  const movieId = params.movieId;
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'TMDB API key not configured' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${apiKey}`,
      { next: { revalidate: 86400 } }
    );

    const data: WatchProviders = await response.json();
    
    if (!response.ok) {
      console.error('TMDB API Error:', data);
      throw new Error(`TMDB API Error: ${JSON.stringify(data)}`);
    }

    // Debug log the raw provider data
    console.log('Raw provider data for movie:', movieId, data);

    const countryCode = 'US';
    const countryData = data.results[countryCode];

    // Debug log the filtered country data
    console.log('Filtered US provider data:', countryData);

    return NextResponse.json({
      providers: countryData || null,
      countryCode,
      rawData: data // Temporarily include raw data for debugging
    });
  } catch (error) {
    console.error('Error fetching watch providers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch watch providers', details: (error as Error).message },
      { status: 500 }
    );
  }
}