// src/components/MovieCard.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface MovieCardProps {
  id: number;
  title: string;
  posterPath: string;
  overview: string;
  voteAverage: number;
}

const MovieCard: React.FC<MovieCardProps> = ({
  title,
  posterPath,
  voteAverage,
  overview,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div className="movie-card" onClick={() => setIsFlipped(!isFlipped)}>
      <motion.div className="card-content" animate={{ rotateY: isFlipped ? 180 : 0 }}>
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
            <p>Rating: {voteAverage}/10</p>
          </div>
        ) : (
          <div className="card-back">
            <h3>{title}</h3>
            <p>{overview}</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default MovieCard;