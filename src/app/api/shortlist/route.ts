import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { movieId } = await request.json();

  // Here you would typically update a database or some persistent storage
  // For this example, we'll just return a success message
  console.log(`Movie ${movieId} has been shortlisted`);

  return NextResponse.json({ success: true, message: 'Movie shortlisted successfully' });
}

