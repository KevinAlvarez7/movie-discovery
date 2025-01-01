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
        <div className="w-full h-full relative overflow-hidden flex justify-center items-center">
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
        {/* Apply transform rotate to content container */}
        <div className="absolute inset-0 flex items-end justify-center pb-4" style={{ transform: `rotate(${tiltAngle}deg)` }}>
          {/* Rest of content container remains the same */}
            {/* Providers Container - Outside TornContainer */}
            {!isLoadingProviders && providers?.flatrate && (
              <div className="absolute top-4 right-4 flex gap-1 bg-white p-2 rounded-lg">
                {providers.flatrate.slice(0, 3).map((provider) => (
                  <Image
                    key={provider.provider_id}
                    src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                    alt={provider.provider_name}
                    width={24}
                    height={24}
                    className="rounded-sm"
                  />
                ))}
              </div>
            )}
          <div className="w-fit flex flex-row items-center mx-4 mb-4 overflow-visible">
          <TornContainer>
            <NoiseBackground
              noiseSize={120}
              noiseOpacity={0.12}
              baseColor="#f1fafa"
              baseOpacity={0.7}
              className="w-fit flex flex-col justify-center p-4 gap-4 backdrop-blur-sm"
            >
              <h3 className='flex flex-row justify-center items-center w-auto font-handwritten font-bold text-black text-lg'>{title}</h3>
              <div className="text-slate-800 text-sm flex flex-row justify-center items-center w-auto gap-2 overflow-visible">
                <p className="m-0 font-handwritten">Rating: </p>
                <StarRating 
                  rating={voteAverage}
                  size={24}
                  className="mt-2"
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