// src/components/MovieCarousel.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { motion, PanInfo } from "framer-motion";
import MovieCard from './MovieCard';
import { Movie } from '@/types/movie';

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
  
  // Manage responsive dimensions for the carousel
  const [dimensions, setDimensions] = useState({
    cardWidth: 0,
    cardHeight: 0,
    gapWidth: 24,
    isMobile: false
  });

  // Update dimensions when window size changes and notify parent of current movie
  useEffect(() => {
    // Update carousel dimensions based on viewport width
    const updateDimensions = () => {
      const vw = window.innerWidth;
      const isMobile = vw <= 480;

      if (isMobile) {
        // Calculate width first (keeping your current logic)
        const cardWidth = vw - 40;
        
        // Calculate height using 2:3 ratio (width:height)
        // Multiply width by 1.5 to get the height (3/2 = 1.5)
        const cardHeight = cardWidth;
        
        setDimensions({
          cardWidth,
          cardHeight, // Add height to dimensions
          gapWidth: 8,
          isMobile: true
        });
        
        // Log dimensions for testing
        console.log('Mobile dimensions:', { cardWidth, cardHeight });
        
      } else {
        // Desktop logic
        const cardWidth = Math.min(Math.max(350, vw * 0.25), 450);
        const cardHeight = cardWidth * 1.5; // Same ratio calculation
        
        setDimensions({
          cardWidth,
          cardHeight,
          gapWidth: Math.min(Math.max(8, vw * 0.05), 12),
          isMobile: false
        });
        
        // Log dimensions for testing
        console.log('Desktop dimensions:', { cardWidth, cardHeight });
      }
    };
    

    // Initial dimension setup
    updateDimensions();
    
    // Listen for window resize events
    window.addEventListener('resize', updateDimensions);
    
    // Cleanup listener on component unmount
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

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

  // Helper function to get current card width
  const getCardWidth = () => dimensions.cardWidth;
  const getCardHeight = () => dimensions.cardHeight;

  return (
    <div className="relative w-full h-full overflow-visible px-4 py-4 md:py-6">
      {/* Carousel container with horizontal layout */}
      <div 
        className="flex items-center h-full transition-transform duration-300 ease-out"
        style={{
          gap: `${dimensions.gapWidth}px`,
          // Center current card and adjust for card width and gaps
          transform: `translateX(calc(50% - ${currentIndex * dimensions.cardWidth}px - ${currentIndex * dimensions.gapWidth}px - ${dimensions.cardWidth / 2}px))`,
        }}
      >
        {/* Map through movies and render cards */}
        {initialMovies.map((movie, index) => {
          const cardWidth = getCardWidth();
          const cardHeight = getCardHeight();
          
          return (
            <motion.div
              key={index}
              className="flex-shrink-0 h-full rounded-2xl 
                  flex flex-col
                  ${isMobile ? 'h-full' : ''} "
              style={{
                width: `${cardWidth}px`,
                height: dimensions.isMobile ? '100%' : `${cardHeight}px`,
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
                  ? '0 0 16px 2px rgba(255, 255, 255, 0.2)' 
                  : '0 0 10px 0px rgba(255, 255, 255, 0.1)'
              }}
              transition={{
                duration: 0.3,
                ease: "easeInOut"
              }}
            >
              <div className="w-full h-full rounded-2xl overflow-hidden">
                <MovieCard {...movie} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation buttons */}
      <button
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
      </button>
    </div>
  );
};

export default MovieCarousel;