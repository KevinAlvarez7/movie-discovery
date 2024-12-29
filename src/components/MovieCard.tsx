// src/components/MovieCard.tsx
"use client";

import React, { JSX } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import ReactStars from 'react-stars';

interface MovieCardProps {
  title: string;
  posterPath: string;
  voteAverage: number;
}

const MovieCard = ({ 
  title, 
  posterPath,
  voteAverage 
}: MovieCardProps): JSX.Element => {
  return (
    <motion.div className="w-full h-full rounded-2xl">
      <div className="w-full h-full relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            className="rounded-lg w-full h-full"
            src={`https://image.tmdb.org/t/p/w500${posterPath}`}
            alt={title}
            width={1000}
            height={1500}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            priority
          />
        </div>
        <div className="border rounded-xl absolute bottom-0 left-0 right-0 flex flex-col m-4 p-4 gap-4 bg-gradient-to-t from-white/75 to-white/25 backdrop-blur-[2px]">
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