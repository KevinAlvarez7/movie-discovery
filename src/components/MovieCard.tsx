// src/components/MovieCard.tsx
"use client";

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
    <motion.div 
      className="relative w-72 h-[450px] cursor-pointer perspective-1000"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div 
        className="relative w-full h-full transition-transform duration-500 transform-style-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
      >
        {!isFlipped ? (
          <div className="absolute w-full h-full bg-white rounded-lg shadow-lg backface-hidden">
            <div className="relative w-full h-[350px]">
              <Image 
                src={`https://image.tmdb.org/t/p/w500${posterPath}`}
                alt={title}
                fill
                className="rounded-t-lg object-cover"
                priority
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold truncate">{title}</h3>
              <p className="text-sm text-gray-600">Rating: {voteAverage.toFixed(1)}/10</p>
            </div>
          </div>
        ) : (
          <div className="absolute w-full h-full p-6 bg-white rounded-lg shadow-lg backface-hidden transform rotate-y-180">
            <h3 className="text-xl font-semibold mb-4">{title}</h3>
            <p className="text-gray-600 text-sm line-clamp-[12]">{overview}</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default MovieCard;