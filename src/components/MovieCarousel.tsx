"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Movie } from '@/types/movie';
import { useShortlist } from '@/hooks/useShortlist';
import { ToastNotification } from './ToastNotification';
import { DragIndicator } from './DragIndicator';
import { ButtonContainer } from './ButtonContainer';
import { useRouter } from 'next/navigation';
import MovieCard from './MovieCard';

interface MovieCarouselProps {
  initialMovies: Movie[];
  onLoadMore: () => Promise<void>;
  isLoading: boolean;
}

export const MovieCarousel = ({ initialMovies, onLoadMore, isLoading }: MovieCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDraggingVertically, setIsDraggingVertically] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [dimensions, setDimensions] = useState({
    cardWidth: 350,
    cardHeight: 525,
    gapWidth: 24,
    isMobile: false
  });
  const dragStartY = useRef(0);
  const { addMovie, getCount } = useShortlist();
  const router = useRouter();
  
  // Vertical drag handling
  const dragY = useMotionValue(0);
  const dragProgress = useTransform(dragY, [0, 100], [0, 1]);

  const getCardWidth = useCallback((isCenter: boolean) => {
    return dimensions.cardWidth * (isCenter ? 1 : 0.8);
  }, [dimensions.cardWidth]);
  
  const handleDragStart = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    dragStartY.current = info.point.y;
  };

  const handleDrag = (event: any, info: PanInfo) => {
    const offset = info.offset;
    
    // Handle horizontal drag
    if (Math.abs(offset.x) > Math.abs(offset.y)) {
      if (offset.x > 100) {
        // Dragging right - go to previous
        if (currentIndex > 0) {
          setCurrentIndex(prev => prev - 1);
        }
      } else if (offset.x < -100) {
        // Dragging left - go to next
        if (currentIndex < initialMovies.length - 1) {
          setCurrentIndex(prev => prev + 1);
          if (currentIndex === initialMovies.length - 2) {
            onLoadMore();
          }
        }
      }
    } 
    // Handle vertical drag
    else if (offset.y > 0) { // Only track downward drag
      setIsDraggingVertically(true);
      dragY.set(offset.y);
      dragProgress.set(Math.min(offset.y / 400, 1));
    }
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (isDraggingVertically && info.offset.y > 200) {
      handleShortlist();
    }
    setIsDraggingVertically(false);
    dragY.set(0);
    dragProgress.set(0);
  };

  const handleShortlist = useCallback(() => {
    const currentMovie = initialMovies[currentIndex];
    try {
      if (addMovie(currentMovie)) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 1000);
        
        // Move to next card if available, otherwise previous
        if (currentIndex < initialMovies.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else if (currentIndex > 0) {
          setCurrentIndex(prev => prev - 1);
        }
      }
    } catch (error) {
      console.error('Failed to shortlist movie:', error);
    }
  }, [currentIndex, initialMovies, addMovie]);

  const handleViewShortlist = useCallback(() => {
    router.push('/shortlist');
  }, [router]);

  // Add dimensions update effect
  useEffect(() => {
    const updateDimensions = () => {
      const vw = window.innerWidth;
      const isMobile = vw <= 480;
      let cardWidth, gapWidth;

      if (isMobile) {
        cardWidth = vw - 40;
        gapWidth = 8;
      } else {
        cardWidth = Math.min(Math.max(350, vw * 0.25), 450);
        gapWidth = Math.min(Math.max(8, vw * 0.05), 12);
      }

      // Calculate height maintaining 2:3 ratio
      const cardHeight = (cardWidth * 3) / 2;

      setDimensions({
        cardWidth,
        cardHeight,
        gapWidth,
        isMobile
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Add useEffect for session clearing on page refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.clear();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div className="flex flex-col w-full h-full relative">
      <ToastNotification 
        message="Movie shortlisted!" 
        isVisible={showToast} 
      />
      
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
            const cardHeight = (cardWidth * 3) / 2;
            
            return (
              <motion.div
                key={index}
                className="flex-shrink-0 rounded-2xl"
                style={{
                  width: `${cardWidth}px`,
                  height: `${cardHeight}px`,
                  zIndex: index === currentIndex ? 10 : 0,
                  boxShadow: index === currentIndex 
                    ? '0 0 16px 2px rgba(255, 255, 255, 0.2)' 
                    : '0 0 10px 0px rgba(255, 255, 255, 0.1)'
                }}
                drag={index === currentIndex ? true : false}
                dragDirectionLock
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragStart={handleDragStart}
                onDrag={handleDrag}
                onDragEnd={handleDragEnd}
                animate={{
                  y: isDraggingVertically ? dragY.get() : 0,
                  scale: index === currentIndex ? 1 : 0.8,
                  filter: index === currentIndex ? 'brightness(1)' : 'brightness(0.7)',
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut"
                }}
              >
                <MovieCard {...movie} />
                {index === currentIndex && isDraggingVertically && (
                  <DragIndicator progress={dragProgress.get()} />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="w-full mt-auto">
        <ButtonContainer
          movieCount={getCount()}
          onShortlist={handleShortlist}
          onViewShortlist={handleViewShortlist}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};