import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useMovieContext } from '@/context/MovieContext';

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
        whileHover={{
            scale: 1.05,
            boxShadow: "0 0 12px rgba(0, 0, 0, 0.3)",
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 15
            }
        }}
        whileTap={{
            scale: 0.98,
            boxShadow: "0 0 4px rgba(0, 0, 0, 0.9)",
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 15
            }
        }}
      >
        <span>
          {shortlistedMovies.length === 0 ? 
            `View Shortlisted Movies` :
            shortlistedMovies.length === 1 ?
            `View ${shortlistedMovies.length} Shortlisted Movie` :
            `View ${shortlistedMovies.length} Shortlisted Movies`}
        </span>
      </motion.button>
    </motion.div>
  );
};

export default ShortlistButton;