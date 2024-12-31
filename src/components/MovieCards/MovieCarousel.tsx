// src/components/MovieCarousel.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { motion, PanInfo } from "framer-motion";
import MovieCard from './MovieCard';
import { Movie } from '@/types/TMDBMovie';
import { useStreamingStore, StreamingService } from '@/store/streaming'; // Update this import path
import type { Dimensions } from '@/types/Dimensions';

interface MovieCarouselProps {
  initialMovies: Movie[];
  onLoadMore: () => Promise<void>;
  isLoading: boolean;
  onCurrentMovieChange?: (movie: Movie) => void;
}

const MovieCarousel = ({ 
  initialMovies, 
  onLoadMore, 
  isLoading,
  onCurrentMovieChange 
}: MovieCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { selectedServices, currentRegion, updateMovieProviders } = useStreamingStore();
  const [dimensions, setDimensions] = useState<Dimensions>({
    cardWidth: 350,
    cardHeight: 525,
    gapWidth: 8,
    isMobile: false
  });

  const [processedMovies, setProcessedMovies] = useState<Movie[]>(initialMovies);

  useEffect(() => {
    const processMovies = async () => {
      const moviesWithProviders = await updateMovieProviders(initialMovies);
      const filtered = selectedServices.size === 0 
        ? moviesWithProviders
        : moviesWithProviders.filter(movie => 
            movie.providers?.some(provider => 
              selectedServices.has(provider as StreamingService)
            )
          );
      setProcessedMovies(filtered);
      setCurrentIndex(0); // Reset index when filters change
    };

    processMovies();
  }, [initialMovies, selectedServices, currentRegion, updateMovieProviders]);


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

// Update these functions
const handleNext = () => {
  setCurrentIndex((prev) => {
    // If at the end, trigger load more but don't change index
    if (prev === processedMovies.length - 1) {
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

// Update the current movie effect
useEffect(() => {
  if (processedMovies[currentIndex]) {
    onCurrentMovieChange?.(processedMovies[currentIndex]);
    console.log('Current movie updated:', processedMovies[currentIndex].title);
  }
}, [currentIndex, processedMovies, onCurrentMovieChange]);

  // Handle drag gesture for navigation
  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100) {
      handlePrev();
    } else if (info.offset.x < -100) {
      handleNext();
    }
  };

 {/* Replace your return section with this */}
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
        {/* Map through processedMovies instead of initialMovies */}
        {processedMovies.map((movie, index) => {
          const cardWidth = dimensions.cardWidth;
          const cardHeight = dimensions.cardHeight;
          
          return (
            <motion.div
              key={movie.id} // Better to use movie.id than index if available
              className={`flex-shrink-0 h-full rounded-2xl flex flex-col
                  ${dimensions.isMobile ? 'h-full' : ''}`}
              style={{
                width: `${cardWidth}px`,
                height: dimensions.isMobile ? '100%' : `${cardHeight}px`,
              }}
              drag="x"
              dragElastic={0.1}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDrag}
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
                  {...movie}
                  posterPath={movie.poster_path || ''} 
                  voteAverage={movie.vote_average || 0} 
                />
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
        disabled={currentIndex === processedMovies.length - 1 || isLoading}
      >
        Next
      </button>
    </div>
  );
}

export default MovieCarousel;