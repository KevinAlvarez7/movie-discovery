import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

// Helper to get or create session ID
function getSessionId() {
  const cookieStore = cookies();
  let sessionId = cookieStore.get('sessionId')?.value;
  
  if (!sessionId) {
    sessionId = uuidv4();
    // Note: in production, you might want to add more cookie options
    cookieStore.set('sessionId', sessionId);
  }
  
  return sessionId;
}

// GET /api/shortlist - Fetch all shortlisted movies for the session
export async function GET() {
  try {
    const sessionId = getSessionId();
    
    const shortlistedMovies = await prisma.shortlistedMovie.findMany({
      where: {
        sessionId: sessionId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(shortlistedMovies);
  } catch (error) {
    console.error('Failed to fetch shortlisted movies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shortlisted movies' },
      { status: 500 }
    );
  }
}

// POST /api/shortlist - Add a movie to shortlist
export async function POST(request: Request) {
  try {
    const sessionId = getSessionId();
    const body = await request.json();
    
    const { movieId, title, posterPath, voteAverage, providers } = body;

    const movie = await prisma.shortlistedMovie.create({
      data: {
        movieId,
        title,
        posterPath,
        voteAverage,
        providers,
        sessionId
      }
    });

    return NextResponse.json(movie);
  } catch (error) {
    console.error('Failed to add movie to shortlist:', error);
    return NextResponse.json(
      { error: 'Failed to add movie to shortlist' },
      { status: 500 }
    );
  }
}

// DELETE /api/shortlist?movieId={id} - Remove a movie from shortlist
export async function DELETE(request: Request) {
  try {
    const sessionId = getSessionId();
    const { searchParams } = new URL(request.url);
    const movieId = Number(searchParams.get('movieId'));

    if (!movieId) {
      return NextResponse.json(
        { error: 'Movie ID is required' },
        { status: 400 }
      );
    }

    await prisma.shortlistedMovie.delete({
      where: {
        movieId_sessionId: {
          movieId,
          sessionId
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to remove movie from shortlist:', error);
    return NextResponse.json(
      { error: 'Failed to remove movie from shortlist' },
      { status: 500 }
    );
  }
} 