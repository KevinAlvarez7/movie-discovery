// src/components/MovieCarousel.tsx
"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);
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

  // Add effect for loading more movies
  useEffect(() => {
    if (currentIndex >= initialMovies.length - WINDOW_SIZE && !isLoading) {
      console.log('Loading more movies...');
      onLoadMore();
    }
  }, [currentIndex, initialMovies.length, isLoading, onLoadMore]);

  // Modify handleNext to remove direct onLoadMore call
  const handleNext = () => {
    setCurrentIndex((prev) => 
      prev === initialMovies.length - 1 ? prev : prev + 1
    );
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
    <div className="relative w-full h-full overflow-visible px-4 md:py-6">
      <div 
        ref={containerRef}
        className="flex items-center h-full justify-center"
        style={{
          gap: `${cardDimensions.gapWidth}px`,
        }}
      >
        {visibleMovies.map((movie, index) => {
          const absoluteIndex = index + windowOffset;
          const position = absoluteIndex - currentIndex;
          const isVisible = Math.abs(position) <= 2;
          const isNewCard = position > 0;
          const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
          
          return (
            <motion.div
              key={`${movie.id}-${absoluteIndex}`}
              className="flex-shrink-0 h-full rounded-2xl flex flex-col"
              style={{
                width: `${cardDimensions.cardWidth}px`,
                height: cardDimensions.isMobile ? '85%' : `${cardDimensions.cardHeight}px`,
                position: 'absolute',
                left: '50%',
                visibility: isVisible ? 'visible' : 'hidden'
              }}
              initial={{ 
                x: `calc(${isNewCard ? viewportWidth : -viewportWidth}px - 50%)`,
                opacity: 0,
                scale: 0.8
              }}
              animate={{
                x: `calc(${position * (cardDimensions.cardWidth + 20)}px - 50%)`,
                scale: Math.abs(position) <= 1 
                  ? (position === 0 ? 1 : 0.9)
                  : 0.8,
                filter: position === 0 ? 'brightness(1)' : 'brightness(0.7)',
                opacity: isVisible ? 1 : 0,
                boxShadow: position === 0
                  ? '0 0 16px 0px rgba(0, 0, 0, 0.3)' 
                  : '0 0 8px 0px rgba(0, 0, 0, 0.1)'
              }}
              drag="x"
              dragElastic={0.01}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDrag}
              transition={{
                x: {
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                  mass: 0.8,
                  duration: 1
                },
                opacity: {
                  duration: 0.3
                },
                scale: {
                  duration: 0.3
                },
                filter: {
                  duration: 0.2
                },
                default: {
                  type: "spring",
                  stiffness: 100,
                  damping: 10,
                  mass: 0.8,
                  duration: 0.3
                }
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