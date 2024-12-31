// src/components/PageLoader.tsx
import React from 'react';
import { motion } from 'framer-motion';

const PageLoader = () => {
  const rectangleColors = [
    'bg-gray-700',
    'bg-gray-600',
    'bg-gray-700',
    'bg-gray-600',
    'bg-gray-700'
  ];

  return (
    <motion.div 
      className="fixed inset-0 flex items-center justify-center bg-gray-950 z-50"
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        transition: { duration: 0.5, ease: "easeOut" }
      }}
    >
      <div className="flex justify-center items-center gap-4">
        {rectangleColors.map((color, index) => (
          <motion.div
            key={index}
            className={`w-12 h-20 rounded-lg ${color}`}
            initial={{ y: 0 }}
            animate={{ y: [0, -20, 0] }}
            exit={{ y: [0, -20, 0] }}
            transition={{
              duration: 1,
              ease: "easeInOut",
              times: [0, 0.5, 1],
              delay: index * 0.2,
              repeat: Infinity,
              repeatDelay: 1,
              repeatType: "loop"
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default PageLoader;