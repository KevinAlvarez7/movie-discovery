import { motion } from 'framer-motion';
import { BookmarkIcon } from '@heroicons/react/24/outline';

interface BookmarkButtonProps {
  count: number;
  onClick: () => void;
  className?: string;
}

export const BookmarkButton = ({ count, onClick, className = '' }: BookmarkButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      className={`relative inline-flex items-center justify-center p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <BookmarkIcon className="w-6 h-6 text-white" />
      {count > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
        >
          {count}
        </motion.div>
      )}
    </motion.button>
  );
}; 