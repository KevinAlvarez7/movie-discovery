"use client";

import { motion } from 'framer-motion';
import { useCardDimensions } from '@/hooks/useCardDimensions';

const MovieCardSkeleton = () => {
  const { cardWidth } = useCardDimensions();
  
  return (
    <motion.div>
      <div 
        className="bg-black/20 rounded-xl shadow-md overflow-hidden"
        style={{
          width: `${cardWidth}px`,
          aspectRatio: '2/3'
        }}
      >
        <div className="w-full h-3/4 bg-black/40 rounded-t-xl animate-pulse" />
        <div className="p-4 flex flex-col gap-2">
          <div className="h-12 bg-black/30 rounded w-3/4 mb-2 animate-pulse" />
          <div className="h-8 bg-black/30 rounded w-1/2 animate-pulse" />
        </div>
      </div>
    </motion.div>
  );
};

export default MovieCardSkeleton;    