// src/components/MovieCard.tsx
"use client";

import React, { JSX } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import ReactStars from 'react-stars';
import { NoiseBackground } from '../UI/NoiseBackground';
import TornContainer from '../UI/TornContainer';

interface MovieCardProps {
  title: string;
  posterPath: string;
  voteAverage: number;
}

const MovieCard = ({ title, posterPath, voteAverage }: MovieCardProps): JSX.Element => {
  // Generate random tilt between -2 and 2 degrees for content container
  const tiltAngle = React.useMemo(() => Math.random() * 6 - 3, []);

  console.log(`Content tilt for ${title}: ${tiltAngle}deg`);

  return (
    <motion.div className="w-full h-full rounded-xl">
      <div className="w-full h-full relative overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            className="rounded-lg w-full h-full pointer-events-none"
            src={`https://image.tmdb.org/t/p/w500${posterPath}`}
            alt={title}
            width={1000}
            height={1500}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            priority
          />
        </div>
        {/* Apply transform rotate to content container */}
        <div className="absolute inset-x-0 bottom-0" style={{ transform: `rotate(${tiltAngle}deg)` }}>
          {/* Rest of content container remains the same */}
          <div className="mx-4 mb-4 overflow-visible">
          <TornContainer>
            <NoiseBackground
              noiseSize={120}
              noiseOpacity={0.12}
              baseColor="#f1fafa"
              baseOpacity={0.7}
              className="flex flex-col p-4 gap-4 backdrop-blur-sm"
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
          </TornContainer>
        </div>
      </div>
      </div>
    </motion.div>
  );
};

export default MovieCard;