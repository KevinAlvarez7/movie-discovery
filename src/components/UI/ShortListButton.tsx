import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useMovieContext } from '@/context/MovieContext';
import { Bookmark } from 'lucide-react';

interface ShortlistButtonProps {
  width: number;
}

const ShortlistButton = ({ width }: ShortlistButtonProps) => {
  const router = useRouter();
  const { shortlistedMovies } = useMovieContext();
  
  // Function to navigate to shortlist page
  const handleNavigateToShortlist = () => {
    console.log('Navigating to shortlist page');
    router.push('/shortlist');
  };

  return (
    <motion.div 
      className="w-full flex flex-row justify-center items-center mt-2 px-5"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 100,
        damping: 10,
        duration: 0.3 
    }}
    >
      <motion.button
        className={`flex items-center justify-center gap-2 p-4 rounded-t-2xl 
                   bg-black/20 backdrop-blur-sm shadow-2xl font-handwritten
                   transition-colors duration-200`}
        style={{ width: `${width}px` }}
        onClick={handleNavigateToShortlist}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          key={shortlistedMovies.length}
          initial={{ scale: 1, rotate: 0 }}
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [-6, 2, -6],
          }}
          transition={{ 
            duration: 0.5,
            type: "spring",
            stiffness: 300,
            damping: 10,
            times: [0, 0.5, 1]
          }}
        >
          <Bookmark 
            className={shortlistedMovies.length === 0 ? "text-white" : "text-yellow-500"}
            fill={shortlistedMovies.length === 0 ? "none" : "currentColor"} 
          />
        </motion.div>

        <span className="flex items-center gap-2">
        
          <AnimatePresence mode="wait">
            <motion.span
              key={shortlistedMovies.length}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              {shortlistedMovies.length >= 0 && shortlistedMovies.length}
            </motion.span>
          </AnimatePresence>
          {shortlistedMovies.length === 0 
            ? "Shortlisted Movie"
            : shortlistedMovies.length === 1
            ? "Shortlisted Movie"
            : "Shortlisted Movies"}
        </span>
      </motion.button>
    </motion.div>
  );
};

export default ShortlistButton;