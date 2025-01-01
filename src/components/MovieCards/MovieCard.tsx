// src/components/MovieCard.tsx
"use client";

import React, { JSX, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import StarRating from '../UI/StarRating';
import { NoiseBackground } from '../UI/NoiseBackground';
import TornContainer from '../UI/TornContainer';
import { CountryProviders } from '@/types/TMDBProvider'; // Import provider types

interface MovieCardProps {
  title: string;
  poster_path: string;
  voteAverage: number;
  movieId: number; // Add movieId to fetch providers
}

const MovieCard = ({ title, poster_path, voteAverage, movieId }: MovieCardProps): JSX.Element => {
  // Generate random tilt between -2 and 2 degrees for content container
  const tiltAngle = React.useMemo(() => Math.random() * 6 - 3, []);

    // Add state for providers
    const [providers, setProviders] = useState<CountryProviders | null>(null);
    const [isLoadingProviders, setIsLoadingProviders] = useState(true);

    // Fetch providers when component mounts
    useEffect(() => {
      const fetchProviders = async () => {
        // Only fetch if movieId is valid (greater than 0)
        if (!movieId || movieId <= 0) {
          console.log('Invalid movieId:', movieId);
          return;
        }

        try {
          const response = await fetch(`/api/providers/${movieId}`);
          const data = await response.json();
          
          if (data.error) {
            console.error('Error in provider data:', data.error);
            return;
          }
          
          console.log('Provider data for movie:', title, data);
          setProviders(data.providers);
        } catch (err) {
          console.error('Error fetching providers for movie:', title, err);
        } finally {
          setIsLoadingProviders(false);
        }
      };
  
      fetchProviders();
    }, [movieId, title]);



  return (
// Often adding to just the inner div is enough
      <motion.div className="w-full h-full flex justify-center items-center rounded-xl">
        <div className="w-full h-full relative overflow-hidden">
        <div className="absolute inset-0">
          {poster_path && (
            <Image
              src={`https://image.tmdb.org/t/p/w500${poster_path}`}
              alt={title}
              fill
              className="object-cover rounded-xl"
              priority
            />
          )}
        </div>
          {/* Providers Container - Outside TornContainer */}
          {!isLoadingProviders && providers?.flatrate && (
            <div className="absolute right-3 top-4 z-20 flex gap-3">
              {providers.flatrate.slice(0, 3).map((provider) => {
                const providerTilt = Math.random() * 12 - 6; // Generate unique tilt for each provider
                return (
                  <div 
                    key={provider.provider_id}
                    className="bg-white p-[3px] sm:p-[4px] rounded-xl sm:rounded-2xl drop-shadow-[0_1px_1px_rgba(0,0,0,1)]"
                    style={{ transform: `rotate(${providerTilt}deg)`}} 
                  >
                    <Image
                      src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                      alt={provider.provider_name}
                      width={24}
                      height={24}
                      className="rounded-lg sm:rounded-xl w-[36px] h-[36px] sm:w-[40px] sm:h-[40px]"
                    />
                  </div>
                );
              })}
            </div>
          )}
        {/* Apply transform rotate to content container */}
        <div className="absolute inset-0 flex items-end justify-center pb-4" style={{ transform: `rotate(${tiltAngle}deg)` }}>
          <div className="w-fit flex flex-row items-center mx-4 mb-4 overflow-visible">
          <TornContainer>
            <NoiseBackground
              noiseSize={120}
              noiseOpacity={0.12}
              baseColor="#f1fafa"
              baseOpacity={0.7}
              className="w-fit flex flex-col justify-center p-6 gap-4 backdrop-blur-sm"
            >
              <h3 className='flex-row justify-center items-center w-auto font-handwritten font-bold inline-flex text-black text-lg'>{title}</h3>
              <div className="text-slate-800 text-sm flex flex-row justify-center items-center w-auto gap-2">
                <p className="m-0 font-handwritten">Rating: </p>
                <StarRating 
                  rating={voteAverage}
                  size={24}
                  className=""
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