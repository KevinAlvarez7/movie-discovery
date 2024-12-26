// src/components/MovieCarousel.tsx
import React from 'react';
import { motion } from 'framer-motion';
import MovieCard from './MovieCard';

interface Movie {
  id: number;
  title: string;
  posterPath: string;
  imdbRating: number;
  rottenTomatoesRating: number;
  streamingPlatform: string;
  synopsis: string;
}

interface MovieCarouselProps {
  movies: Movie[];
  onSwipeDown: (movieId: number) => void;
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({ movies, onSwipeDown }) => {
  return (
    <motion.div className="movie-carousel">
      {movies.map((movie) => (
        <motion.div
          key={movie.id}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          onDragEnd={(_, info) => {
            if (info.offset.y > 100) {
              onSwipeDown(movie.id);
            }
          }}
        >
          <MovieCard {...movie} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default MovieCarousel;