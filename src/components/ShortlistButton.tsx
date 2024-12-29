import { motion } from 'framer-motion';

interface ShortlistButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export const ShortlistButton = ({ onClick, disabled = false, className = '' }: ShortlistButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`flex-1 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      Shortlist
    </motion.button>
  );
}; 