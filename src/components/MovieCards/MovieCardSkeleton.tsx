"use client";

import { motion } from 'framer-motion';
import { useCardDimensions } from '../../hooks/useCardDimensions';

const MovieCardSkeleton = () => {
  const { cardWidth, cardHeight, isMobile } = useCardDimensions();
  
  return (
    <motion.div>
      <div 
        className="bg-black/20 border-4 border-white/5 rounded-2xl shadow-md overflow-hidden flex flex-col animate-pulse"
        style={{
          width: `${cardWidth}px`,
          height: isMobile ? '85%' : `${cardHeight}px`,
          aspectRatio: '2/3'
        }}
      >
        <div className="w-full h-3/4 bg-black/40 rounded-t-xl animate-pulse" />
        <div className="p-4 flex flex-col gap-2 h-1/4">
          <div className="h-1/4 bg-black/30 rounded w-3/4 mb-2 animate-pulse" />
          <div className="h-1/4 bg-black/30 rounded w-1/2 animate-pulse" />
        </div>
      </div>
    </motion.div>
  );
};

export default MovieCardSkeleton;    