// src/pages/index.tsx
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import MovieCarousel from '../components/MovieCarousel';
import FilterSection from '../components/FilterSection';
import axios from 'axios';

interface FilterValues {
  type?: 'movie' | 'series';
  imdbRating?: number;
}

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  vote_count: number;
  overview: string;
  posterPath: string;
  imdbRating: number;
  rottenTomatoesRating: number;
  streamingPlatform: string;
  synopsis: string;
}

interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  vote_count: number;
  overview: string;
}

const Home: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filters, setFilters] = useState<FilterValues>({});

  useEffect(() => {
    fetchMovies();
  }, [filters]);

  const fetchMovies = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&sort_by=popularity.desc`
      );
      const transformedMovies = response.data.results.map((movie: TMDBMovie) => ({
        ...movie,
        posterPath: movie.poster_path,
        imdbRating: movie.vote_average,
        rottenTomatoesRating: 75,
        streamingPlatform: 'Netflix',
        synopsis: movie.overview
      }));
      setMovies(transformedMovies);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const handleSwipeDown = (movieId: number) => {
    setMovies(movies.filter((movie) => movie.id !== movieId));
  };

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters({ ...filters, ...newFilters });
  };

  return (
    <Layout>
      <FilterSection onFilterChange={handleFilterChange} />
      <MovieCarousel movies={movies} onSwipeDown={handleSwipeDown} />
    </Layout>
  );
};

export default Home;