// src/components/MovieCard.tsx
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import ReactStars from 'react-stars';

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
}) => {
  return (
    <motion.div className="w-full h-full">
      <div className="w-full h-full relative bg-white rounded-lg overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            className="rounded-lg w-full h-full"
            src={`https://image.tmdb.org/t/p/w500${posterPath}`}
            alt={title}
            width={0}
            height={0}
            sizes="(max-width: 480px) 100vw, 50vw"
            style={{ width: '100%', height: '100%', objectFit: 'fill' }}
            priority
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex flex-col p-4 gap-4 bg-gradient-to-t from-white/50 to-transparent backdrop-blur-[2px]">
          <h3 className='font-bold text-black text-lg'>{title}</h3>
          <div className="text-slate-800 text-sm flex items-center gap-2">
            <p className="m-0">Rating: </p>
            <ReactStars
              count={5}
              value={voteAverage / 2}
              edit={false}
              size={20}
              color2={'#ffd700'}
            />
            <span>({voteAverage.toFixed(1)})</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MovieCard;