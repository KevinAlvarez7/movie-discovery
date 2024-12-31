"use client";

import { motion } from 'framer-motion';

const PageLoader = () => {
  return (
    <motion.div 
      className="fixed inset-0 flex items-center justify-center bg-gray-950 z-50"
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        transition: { duration: 0.5, ease: "easeOut" }  
      }}
    >
      <motion.div 
        className="w-16 h-16 border-4 border-t-white border-opacity-20 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  );
};

export default PageLoader; 