// src/components/MovieCarousel.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, PanInfo } from "framer-motion";
import MovieCard from './MovieCard';
import { Movie } from '../../types/TMDBMovie';
import { useCardDimensions } from '../../hooks/useCardDimensions';
import { LOAD_THRESHOLD } from '../../hooks/useMovieCache';

interface MovieCarouselProps {
  initialMovies: Movie[];
  onLoadMore: () => Promise<void>;
  isLoading: boolean;
  // New prop: Callback function to notify parent component of current movie changes
  onCurrentMovieChange?: (movie: Movie) => void;
}

const MovieCarousel = ({ 
  initialMovies, 
  onLoadMore, 
  isLoading,
  onCurrentMovieChange 
}: MovieCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardDimensions = useCardDimensions();
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle scroll/swipe
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = cardDimensions.cardWidth / 4;
    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0 && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      } else if (info.offset.x < 0 && currentIndex < initialMovies.length - 1) {
        setCurrentIndex(prev => prev + 1);
      }
    }
  };

  // Center current card
  useEffect(() => {
    if (containerRef.current) {
      const scrollPosition = currentIndex * (cardDimensions.cardWidth + 16); // 16 is the gap
      containerRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, [currentIndex, cardDimensions.cardWidth]);

  useEffect(() => {
    console.log("MovieCarousel initialMovies:", initialMovies);
    if (initialMovies.length === 0) {
      console.warn("No movies received in MovieCarousel");
    }
  }, [initialMovies]);

  useEffect(() => {
    if (currentIndex >= initialMovies.length - 2 && !isLoading) {
      onLoadMore();
    }
  }, [currentIndex, initialMovies.length, isLoading, onLoadMore]);

  useEffect(() => {
    if (initialMovies[currentIndex] && !isLoading) {
      onCurrentMovieChange(initialMovies[currentIndex]);
    }
  }, [currentIndex, initialMovies, onCurrentMovieChange, isLoading]);

  if (!initialMovies || initialMovies.length === 0) {
    console.log("Rendering empty state");
    return <div>Loading movies...</div>;
  }

  return (
    <div className="relative w-full h-full overflow-visible px-4 py-4 md:py-6">
      <div 
        ref={containerRef}
        className="flex items-center h-full transition-transform duration-300 ease-out"
        style={{
          gap: `${cardDimensions.gapWidth}px`,
          transform: `translateX(calc(50% - ${currentIndex * cardDimensions.cardWidth}px - ${currentIndex * cardDimensions.gapWidth}px - ${cardDimensions.cardWidth / 2}px))`,
        }}
      >
        {initialMovies.map((movie, index) => (
          <motion.div
            key={movie.id}
            className="flex-shrink-0 h-full rounded-2xl flex flex-col"
            style={{
              width: `${cardDimensions.cardWidth}px`,
              height: cardDimensions.isMobile ? '85%' : `${cardDimensions.cardHeight}px`,
            }}
            drag="x"
            dragElastic={0.1}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            animate={{
              scale: index === currentIndex ? 1 : 0.9,
              filter: index === currentIndex ? 'brightness(1)' : 'brightness(0.7)',
              boxShadow: index === currentIndex 
                ? '0 0 16px 0px rgba(0, 0, 0, 0.3)' 
                : '0 0 8px 0px rgba(0, 0, 0, 0.1)'
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut"
            }}
          >
            <div className="w-full h-full rounded-2xl overflow-hidden">
              <MovieCard 
                title={movie.title}
                poster_path={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : ''}
                voteAverage={movie.vote_average}
                movieId={movie.id}
                providers={movie.providers}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MovieCarousel;