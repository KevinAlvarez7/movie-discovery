"use client";

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
    <div className="relative w-full overflow-hidden">
      <div className="flex flex-wrap justify-center gap-6 p-4">
        {movies.map((movie) => (
          <motion.div
            key={movie.id}
            className="relative"
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) {
                handleSwipeDown(movie.id);
              }
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MovieCard {...movie} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MovieCarousel;