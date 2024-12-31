// src/components/MovieCarousel.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { motion, PanInfo } from "framer-motion";
import MovieCard from './MovieCard';
import { Movie } from '@/types/TMDBMovie';
import { useCardDimensions } from '@/hooks/useCardDimensions';

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
    // Track the index of the currently displayed movie
    const [currentIndex, setCurrentIndex] = useState(0);
    
    const cardDimensions = useCardDimensions();

  // Add new state for infinite loading
  const [shouldLoadMore, setShouldLoadMore] = useState(false);

  // Add infinite loading effects
  useEffect(() => {
    if (currentIndex >= initialMovies.length - 10 && !isLoading) {
      setShouldLoadMore(true);
    }
  }, [currentIndex, initialMovies.length, isLoading]);

  useEffect(() => {
    if (shouldLoadMore) {
      onLoadMore();
      setShouldLoadMore(false);
    }
  }, [shouldLoadMore, onLoadMore]);


  // Notify parent component when current movie changes
  useEffect(() => {
    if (initialMovies[currentIndex]) {
      onCurrentMovieChange?.(initialMovies[currentIndex]);
      console.log('Current movie updated:', initialMovies[currentIndex].title);
    }
  }, [currentIndex, initialMovies, onCurrentMovieChange]);

  // Handle next movie navigation
  const handleNext = () => {
    setCurrentIndex((prev) => {
      // If at the end, trigger load more but don't change index
      if (prev === initialMovies.length - 1) {
        onLoadMore();
        return prev;
      }
      return prev + 1;
    });
  };

  // Handle previous movie navigation
  const handlePrev = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? prev : prev - 1
    );
  };

  // Handle drag gesture for navigation
  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100) {
      handlePrev();
    } else if (info.offset.x < -100) {
      handleNext();
    }
  };

  return (
    <div className="relative w-full h-full overflow-visible px-4 py-4 md:py-6">
      {/* Carousel container with horizontal layout */}
      <div 
        className="flex items-center h-full transition-transform duration-300 ease-out"
        style={{
          gap: `${useCardDimensions().gapWidth}px`,
          // Center current card and adjust for card width and gaps
          transform: `translateX(calc(50% - ${currentIndex * useCardDimensions().cardWidth}px - ${currentIndex * useCardDimensions().gapWidth}px - ${useCardDimensions().cardWidth / 2}px))`,
        }}
      >
        {/* Map through movies and render cards */}
        {initialMovies.map((movie, index) => {
          const cardWidth = cardDimensions.cardWidth;
          const cardHeight = cardDimensions.cardHeight;
          
          return (
            <motion.div
              key={index}
              className="flex-shrink-0 h-full rounded-2xl 
                  flex flex-col
                  ${isMobile ? 'h-full' : ''} "
              style={{
                width: `${cardWidth}px`,
                height: cardDimensions.isMobile ? '100%' : `${cardHeight}px`,
              }}
              // Enable horizontal dragging with constraints
              drag="x"
              dragElastic={0.1}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDrag}
              // Animate card appearance based on whether it's current
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
                <MovieCard posterPath={''} voteAverage={0} {...movie} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation buttons */}
      {/* <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 border border-slate-300 bg-white/25 backdrop-blur-[8px] p-2 rounded-full"
        disabled={currentIndex === 0}
      >
        Prev
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 border border-slate-300 bg-white/25 backdrop-blur-[8px] p-2 rounded-full"
        disabled={currentIndex === initialMovies.length - 1 || isLoading}
      >
        Next
      </button> */}
    </div>
  );
};

export default MovieCarousel;