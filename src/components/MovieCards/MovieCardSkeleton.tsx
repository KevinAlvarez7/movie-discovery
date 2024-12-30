"use client";

import { motion } from 'framer-motion';

const MovieCardSkeleton = () => {
  return (
    <motion.div className="bg-white rounded-lg shadow-lg min-w-[256px] max-w-[256px] flex-shrink-0">
      <div>
        <div className="w-full h-[384px] bg-gray-200 rounded-t-lg animate-pulse" />
        <div className="p-2">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
        </div>
      </div>
    </motion.div>
  );
};

export default MovieCardSkeleton; 