"use client";

import React, { useState, useEffect } from 'react';
import { motion, PanInfo } from "framer-motion";
import MovieCard from './MovieCard';
import { Movie } from '@/types/movie';

interface MovieCarouselProps {
  initialMovies: Movie[];
  onLoadMore: () => Promise<void>;
  isLoading: boolean;
}

const MovieCarousel = ({ initialMovies, onLoadMore, isLoading }: MovieCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dimensions, setDimensions] = useState({
    cardWidth: 0,
    gapWidth: 24,
    isMobile: false
  });

  // Update dimensions on mount and window resize
  useEffect(() => {
    const updateDimensions = () => {
      const vw = window.innerWidth;
      const isMobile = vw <= 480;

      if (isMobile) {
        setDimensions({
          cardWidth: vw - 40, // viewport width - 40px
          gapWidth: 8,
          isMobile: true
        });
      } else {
        setDimensions({
          cardWidth: Math.min(Math.max(350, vw * 0.25), 450), // between 350px and 450px
          gapWidth: Math.min(Math.max(24, vw * 0.05), 96), // between 24px and 96px
          isMobile: false
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => {
      if (prev === initialMovies.length - 1) {
        onLoadMore();
        return prev;
      }
      return prev + 1;
    });
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? prev : prev - 1
    );
  };

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100) {
      handlePrev();
    } else if (info.offset.x < -100) {
      handleNext();
    }
  };

  const getCardWidth = (isCenter: boolean) => {
    if (isCenter) return dimensions.cardWidth;
    return dimensions.cardWidth * 0.8; // Now it's 20% smaller (not 80% smaller)
  };

  return (
    <div className="relative w-full h-full overflow-visible px-4 py-4 md:py-6">
      <div 
        className="flex h-full transition-transform duration-300 ease-out"
        style={{
          gap: `${dimensions.gapWidth}px`,
          transform: `translateX(calc(50% - ${currentIndex * getCardWidth(false)}px - ${currentIndex * dimensions.gapWidth}px - ${dimensions.cardWidth / 2}px))`,
        }}
      >
        {initialMovies.map((movie, index) => {
          const cardWidth = getCardWidth(index === currentIndex);
          
          return (
            <motion.div
              key={index}
              className="flex-shrink-0 h-full"
              style={{
                width: `${cardWidth}px`,
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDrag}
              animate={{
                width: cardWidth,
                scale: index === currentIndex ? 1 : 0.8,
                filter: index === currentIndex ? 'brightness(1)' : 'brightness(0.7)',
              }}
              transition={{
                duration: 0.3,
                ease: "easeInOut"
              }}
            >
              <div className="w-full h-full">
                <MovieCard {...movie} />
              </div>
            </motion.div>
          );
        })}
      </div>

      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/50 p-2 rounded-full"
        disabled={currentIndex === 0}
      >
        Prev
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/50 p-2 rounded-full"
        disabled={currentIndex === initialMovies.length - 1 || isLoading}
      >
        Next
      </button>
    </div>
  );
};

export default MovieCarousel;