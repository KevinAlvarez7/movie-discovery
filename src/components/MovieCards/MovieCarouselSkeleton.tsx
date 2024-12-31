// MovieCarouselSkeleton.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useCardDimensions } from '@/hooks/useCardDimensions';
import MovieCardSkeleton from './MovieCardSkeleton';

const MovieCarouselSkeleton = ({ count = 5 }) => {
  const { cardWidth, cardHeight, gapWidth, isMobile } = useCardDimensions();
  const centerIndex = Math.floor(count/2);
  
  console.log('MovieCarouselSkeleton dimensions:', {
    cardWidth,
    cardHeight,
    gapWidth,
    isMobile,
    centerIndex
  });

  return (
    <div className="relative w-full h-full overflow-visible px-4 py-4 md:py-6">
      <div 
        className="flex items-center h-full"
        style={{ 
          gap: `${gapWidth}px`,
          transform: `translateX(calc(50% - ${centerIndex * cardWidth}px - ${centerIndex * gapWidth}px - ${cardWidth / 2}px))`,
        }}
      >
        {Array.from({ length: count }).map((_, index) => (
          <motion.div
            key={index}
            className="flex-shrink-0 h-full rounded-2xl"
            style={{
              width: `${cardWidth}px`,
              height: isMobile ? '100%' : `${cardHeight}px`,
            }}
            animate={{
              scale: index === centerIndex ? 1 : 0.9,
              filter: index === centerIndex ? 'brightness(1)' : 'brightness(0.7)',
              boxShadow: index === centerIndex 
                ? '0 0 16px 0px rgba(0, 0, 0, 0.3)' 
                : '0 0 8px 0px rgba(0, 0, 0, 0.1)'
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut"
            }}
          >
            <div className="w-full h-full">
              <MovieCardSkeleton />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MovieCarouselSkeleton;