// src/components/MovieCarousel.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MovieCard from './MovieCard';
import { Movie } from '@/types/movie';

interface MovieCarouselProps {
  initialMovies: Movie[];
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({ initialMovies }) => {
  const [movies, setMovies] = useState(initialMovies);

  const handleSwipeDown = (movieId: number) => {
    setMovies(movies.filter(movie => movie.id !== movieId));
  };

  return (
    <motion.div className="movie-carousel">
      {movies.map((movie) => (
        <motion.div
          key={movie.id}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          onDragEnd={(_, info) => {
            if (info.offset.y > 100) {
              handleSwipeDown(movie.id);
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