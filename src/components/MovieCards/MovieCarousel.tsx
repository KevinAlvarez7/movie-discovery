// src/components/MovieCarousel.tsx
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, PanInfo } from "framer-motion";
import MovieCard from './MovieCard';
import { Movie } from '../../types/TMDBMovie';
import { useCardDimensions } from '../../hooks/useCardDimensions';

const WINDOW_SIZE = 5; // Show 5 cards at a time (can adjust based on performance)

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
  const cardDimensions = useCardDimensions();

  // Calculate visible window
  const { visibleMovies, windowOffset } = useMemo(() => {
    const centerOffset = Math.floor(WINDOW_SIZE / 2);
    const startIdx = Math.max(0, currentIndex - centerOffset);
    const endIdx = Math.min(startIdx + WINDOW_SIZE, initialMovies.length);
    
    console.log('Window calculation:', {
      currentIndex,
      startIdx,
      endIdx,
      windowSize: endIdx - startIdx,
      totalMovies: initialMovies.length
    });

    return {
      visibleMovies: initialMovies.slice(startIdx, endIdx),
      windowOffset: startIdx
    };
  }, [currentIndex, initialMovies]);

  // Handle navigation
  const handleNext = () => {
    setCurrentIndex((prev) => {
      if (prev >= initialMovies.length - 3 && !isLoading) {
        console.log('Loading more movies...');
        onLoadMore();
      }
      return prev === initialMovies.length - 1 ? prev : prev + 1;
    });
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => prev === 0 ? prev : prev - 1);
  };

  // Handle drag gesture
  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100) {
      handlePrev();
    } else if (info.offset.x < -100) {
      handleNext();
    }
  };

  // Notify parent of current movie change
  useEffect(() => {
    if (initialMovies[currentIndex]) {
      onCurrentMovieChange?.(initialMovies[currentIndex]);
      console.log('Current movie updated:', {
        title: initialMovies[currentIndex].title,
        index: currentIndex,
        windowOffset
      });
    }
  }, [currentIndex, initialMovies, onCurrentMovieChange, windowOffset]);

  return (
    <div className="relative w-full h-full overflow-visible px-4 py-4 md:py-6">
      <div 
        className="flex items-center h-full transition-transform duration-300 ease-out"
        style={{
          gap: `${cardDimensions.gapWidth}px`,
          transform: `translateX(calc(50% - ${(currentIndex - windowOffset) * cardDimensions.cardWidth}px - ${(currentIndex - windowOffset) * cardDimensions.gapWidth}px - ${cardDimensions.cardWidth / 2}px))`,
        }}
      >
        {visibleMovies.map((movie, index) => {
          const absoluteIndex = index + windowOffset;
          return (
            <motion.div
              key={`${movie.id}-${absoluteIndex}`}
              className="flex-shrink-0 h-full rounded-2xl flex flex-col"
              style={{
                width: `${cardDimensions.cardWidth}px`,
                height: cardDimensions.isMobile ? '85%' : `${cardDimensions.cardHeight}px`,
              }}
              drag="x"
              dragElastic={0.1}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDrag}
              animate={{
                scale: absoluteIndex === currentIndex ? 1 : 0.9,
                filter: absoluteIndex === currentIndex ? 'brightness(1)' : 'brightness(0.7)',
                boxShadow: absoluteIndex === currentIndex 
                  ? '0 0 16px 0px rgba(0, 0, 0, 0.3)' 
                  : '0 0 8px 0px rgba(0, 0, 0, 0.1)'
              }}
              transition={{
                type: "tween",
                duration: 0.2,
                ease: "easeOut"
              }}
            >
              <div className="w-full h-full rounded-2xl overflow-hidden">
                <MovieCard 
                  {...movie}
                  poster_path={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : ''}
                  voteAverage={movie.vote_average || 0}
                  movieId={movie.id}
                  providers={movie.providers}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(MovieCarousel);