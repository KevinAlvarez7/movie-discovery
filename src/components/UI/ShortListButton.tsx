import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useMovieContext } from '@/context/MovieContext';
import { BookmarkPlus } from 'lucide-react';

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.button
        className={`flex items-center justify-center gap-2 p-4 rounded-md 
                   bg-black/10 backdrop-blur-sm shadow-lg hover:bg-black/20
                   transition-colors duration-200`}
        style={{ width: `${width}px` }}
        onClick={handleNavigateToShortlist}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <BookmarkPlus className="w-5 h-5 text-white/70" />
        <span className="font-handwritten text-white/70">
          {shortlistedMovies.length} Shortlisted
        </span>
      </motion.button>
    </motion.div>
  );
};

export default ShortlistButton;