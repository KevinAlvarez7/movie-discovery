"use client";

import React, { JSX, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import StarRating from '../UI/StarRating';
import { NoiseBackground } from '../UI/NoiseBackground';
import { TornContainer } from '../UI/TornContainer';

interface MovieCardProps {
  title: string;
  poster_path: string;
  voteAverage: number;
  movieId: number;
  providers?: {
    flatrate?: Array<{
      provider_id: number;
      provider_name: string;
      logo_path: string;
    }>;
  };
  priority?: boolean;
  loading?: 'eager' | 'lazy';
}

const MovieCard = React.memo(({ title, poster_path, voteAverage, providers, priority, loading }: MovieCardProps): JSX.Element => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const tiltAngle = React.useMemo(() => Math.random() * 6 - 3, []);
  const providerTilts = React.useMemo(() => 
    Array(3).fill(0).map(() => Math.random() * 12 - 6)
  , []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 480);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Debounced keyboard handler
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    // Prevent default behavior for arrow keys
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
      event.preventDefault();
    }
  }, []);

  // Add passive event listener for better performance
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Use requestAnimationFrame for smooth animations
  const updateImageState = useCallback(() => {
    requestAnimationFrame(() => {
      setIsImageLoaded(true);
    });
  }, []);

  const handleImageLoad = useCallback(() => {
    setIsImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  // Generate a tiny thumbnail version (like Instagram's 10x10 blurred preview)
  const tinyThumbPath = poster_path ? 
    `https://image.tmdb.org/t/p/w45${poster_path}` : ''; // Tiny 45px width image
  
  const fullImagePath = poster_path ? 
    `https://image.tmdb.org/t/p/${isMobile ? 'w342' : 'w500'}${poster_path}` : '';

  return (
    <motion.div 
      className="w-full h-full flex justify-center items-center rounded-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative w-full h-full overflow-hidden">
        {/* Tiny blurred thumbnail (Instagram-like effect) */}
        <div
          className="absolute inset-0 transform scale-110"
          style={{
            backgroundImage: `url(${tinyThumbPath})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(20px)',
            opacity: isImageLoaded ? 0 : 1,
            transition: 'opacity 0.3s ease-in-out'
          }}
        />

        {/* Main image */}
        <Image
          src={fullImagePath}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className={`object-cover rounded-2xl transition-opacity duration-300 w-auto h-full select-none pointer-events-none ${
            isImageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          quality={85}
          loading={priority ? "eager" : "lazy"}
        />

        {/* Provider logos */}
        {providers?.flatrate && providers.flatrate.length > 0 && (
          <div className="absolute right-3 top-4 z-20 flex gap-3">
            {providers.flatrate.slice(0, 3).map((provider) => (
              <div 
                key={provider.provider_id}
                className="bg-[#f1fafa] p-[3px] sm:p-[4px] rounded-xl sm:rounded-2xl drop-shadow-[0_1px_1px_rgba(0,0,0,1)]"
              >
                <Image
                  src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                  alt={provider.provider_name}
                  width={40}
                  height={40}
                  className="rounded-lg sm:rounded-xl w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] object-contain"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}

        {/* Movie Info Overlay */}
        <div 
          className="absolute inset-0 flex items-end justify-center pb-4" 
          style={{ transform: `rotate(${tiltAngle}deg)`}}
        >
          <div className="w-fit flex flex-row items-center mx-4 mb-4 overflow-visible">
            <TornContainer>
              <NoiseBackground
                noiseSize={120}
                noiseOpacity={0.12}
                baseColor="#f1fafa"
                baseOpacity={0.7}
                className="w-fit flex flex-col justify-center p-6 gap-4 backdrop-blur-sm"
              >
                <h3 className="flex-row justify-center items-center w-auto font-handwritten font-bold inline-flex text-black text-lg">
                  {title}
                </h3>
                <div className="text-slate-800 text-sm flex flex-row justify-center items-center w-auto gap-2">
                  <p className="m-0 font-handwritten">Rating: </p>
                  <StarRating 
                    rating={voteAverage}
                    size={24}
                  />
                  <span className="font-handwritten">({voteAverage.toFixed(1)})</span>
                </div>
              </NoiseBackground>
            </TornContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

MovieCard.displayName = 'MovieCard';

export default MovieCard;