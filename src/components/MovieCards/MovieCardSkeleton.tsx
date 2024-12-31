"use client";

import { motion } from 'framer-motion';

const MovieCardSkeleton = () => {
  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      <motion.div 
        className="w-full h-full bg-gray-800 rounded-2xl"
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [0.98, 1, 0.98]
        }}
        transition={{
          duration: 1.5,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <div className="absolute bottom-0 w-full p-4">
        <motion.div 
          className="w-3/4 h-6 bg-gray-700 rounded-md mb-2"
          animate={{
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="w-1/2 h-4 bg-gray-700 rounded-md"
          animate={{
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.2
          }}
        />
      </div>
    </div>
  );
};

export default MovieCardSkeleton;