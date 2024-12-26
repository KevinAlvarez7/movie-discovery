// src/components/MovieCard.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface MovieCardProps {
  title: string;
  posterPath: string;
  imdbRating: number;
  rottenTomatoesRating: number;
  streamingPlatform: string;
  synopsis: string;
}

const MovieCard: React.FC<MovieCardProps> = ({
  title,
  posterPath,
  imdbRating,
  rottenTomatoesRating,
  streamingPlatform,
  synopsis,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      className="movie-card"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="card-content"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {!isFlipped ? (
          <div className="card-front">
            <Image 
              src={`https://image.tmdb.org/t/p/w500${posterPath}`}
              alt={title}
              width={500}
              height={750}
              priority
            />
            <h3>{title}</h3>
            <p>IMDB: {imdbRating}</p>
            <p>Rotten Tomatoes: {rottenTomatoesRating}%</p>
            <p>Watch on: {streamingPlatform}</p>
          </div>
        ) : (
          <div className="card-back">
            <h3>{title}</h3>
            <p>{synopsis}</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default MovieCard;