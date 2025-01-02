// src/components/MovieCarousel.tsx
"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion } from "framer-motion";
import MovieCard from './MovieCard';
import { Movie } from '../../types/TMDBMovie';
import { useCardDimensions } from '../../hooks/useCardDimensions';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  const { isMobile } = cardDimensions;

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => 
      prev === initialMovies.length - 1 ? prev : prev + 1
    );
  }, [initialMovies.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => prev === 0 ? prev : prev - 1);
  }, []);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        handlePrev();
      } else if (event.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleNext, handlePrev]);

  const { visibleMovies, windowOffset } = useMemo(() => {
    const centerOffset = Math.floor(WINDOW_SIZE / 2);
    const startIdx = Math.max(0, currentIndex - centerOffset);
    const endIdx = Math.min(startIdx + WINDOW_SIZE, initialMovies.length);
    
    return {
      visibleMovies: initialMovies.slice(startIdx, endIdx),
      windowOffset: startIdx
    };
  }, [currentIndex, initialMovies]);

  useEffect(() => {
    if (currentIndex >= initialMovies.length - WINDOW_SIZE && !isLoading) {
      onLoadMore();
    }
  }, [currentIndex, initialMovies.length, isLoading, onLoadMore]);

  useEffect(() => {
    if (initialMovies[currentIndex]) {
      onCurrentMovieChange?.(initialMovies[currentIndex]);
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
                transform: 'translateZ(0)',
                willChange: 'transform',
                containIntrinsicSize: `${cardDimensions.cardWidth}px ${cardDimensions.cardHeight}px`,
                contain: 'layout'
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
              drag={isMobile ? "x" : false}
              dragElastic={0.1}
              dragConstraints={{ left: 0, right: 0}}
              onDragEnd={(event, info) => {
                if (Math.abs(info.offset.x) > 100) {
                  if (info.offset.x > 0) {
                    handlePrev();
                  } else {
                    handleNext();
                  }
                }
              }}
              transition={{
                x: {
                  type: "spring",
                  stiffness: 150,
                  damping: 30,
                  mass: 0.8,
                  duration: 0.3,
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
                  poster_path={movie.poster_path ? 
                    `https://image.tmdb.org/t/p/${!isMobile ? 'w780' : 'w500'}${movie.poster_path}` : ''}
                  voteAverage={movie.vote_average || 0}
                  movieId={movie.id}
                  providers={movie.providers}
                  priority={Math.abs(position) <= 1}
                  loading={Math.abs(position) <= 2 ? 'eager' : 'lazy'}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {!isMobile && (
        <>
          <motion.button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            initial={{ y: "-50%" }}
            whileHover={{ 
              rotate: -2, 
              scale: 1.05,
              borderColor: "#D9D9D9",
              color: "#ffffff",
              y: "-50%",
              boxShadow: "0 0 16px 20px rgba(0, 0, 0, 0.1)"
            }}
            whileTap={{ scale: 0.95, y: "-50%" }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="font-handwritten absolute left-8 top-1/2 z-10
                      flex flex-row items-center gap-1 py-3 px-4
                      rounded-full border-[#a1a1a1] border-4 bg-[#221F1F] backdrop-blur-sm
                      text-[#a1a1a1] disabled:opacity-10
                      transition-opacity"
          >
            <ChevronLeft size={24} className='rotate-6' />
            <span className="text-md">Prev</span>
          </motion.button>
          <motion.button
            onClick={handleNext}
            disabled={currentIndex === initialMovies.length - 1}
            initial={{ y: "-50%" }}
            whileHover={{ 
              rotate: 2, 
              scale: 1.05,
              borderColor: "#D9D9D9",
              color: "#ffffff",
              y: "-50%",
              boxShadow: "0 0 16px 20px rgba(0, 0, 0, 0.1)"
            }}
            whileTap={{ scale: 0.95, y: "-50%" }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="font-handwritten absolute right-8 top-1/2 z-10
                      flex flex-row items-center gap-1 py-3 px-4
                      rounded-full border-[#a1a1a1] border-4 bg-[#221F1F] backdrop-blur-sm
                      text-[#a1a1a1] disabled:opacity-10
                      transition-opacity"
          >
            <span className="text-md">Next</span>
            <ChevronRight size={24} className='-rotate-6' />
          </motion.button>
        </>
      )}
    </div>
  );
};

export default React.memo(MovieCarousel);