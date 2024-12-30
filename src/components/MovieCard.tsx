// src/components/MovieCard.tsx
"use client";

import React, { JSX } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import ReactStars from 'react-stars';
import { NoiseBackground } from './NoiseBackground';

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
      {/* Added relative positioning to this container */}
      <div className="w-full h-full relative overflow-hidden">
        {/* Image container */}
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
        {/* Content container - forced to bottom */}
        <div className="absolute inset-x-0 bottom-0">
          <NoiseBackground
            noiseSize={120}
            noiseOpacity={0.12}
            baseColor="#f1fafa"
            baseOpacity={0.7}
            className="flex flex-col mx-4 mb-4 p-4 gap-4 shadow-sm rounded-xl backdrop-blur-sm"
          >
            <h3 className='font-handwritten font-bold text-black text-lg'>{title}</h3>
            <div className="text-slate-800 text-sm flex items-center gap-2">
              <p className="m-0 font-handwritten">Rating: </p>
              <ReactStars
                count={5}
                value={voteAverage / 2}
                edit={false}
                size={20}
                color2={'#ffd700'}
              />
              <span className='font-handwritten'>({voteAverage.toFixed(1)})</span>
            </div>
          </NoiseBackground>
        </div>
      </div>
    </motion.div>
  );
};

export default MovieCard;