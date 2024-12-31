import { Movie, TMDBResponse } from '@/types/TMDBMovie';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page')) || 1;
  
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/popular?page=${page}`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.TMDB_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const data: TMDBResponse = await response.json();
  
  const movies: Movie[] = data.results.map((movie) => ({
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    backdrop_path: movie.backdrop_path,
    overview: movie.overview,
    release_date: movie.release_date,
    vote_average: movie.vote_average
  }));

  return Response.json({ movies, total_pages: data.total_pages });
}