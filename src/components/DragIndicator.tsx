import { motion } from 'framer-motion';

interface DragIndicatorProps {
  progress: number; // 0 to 1
}

export const DragIndicator = ({ progress }: DragIndicatorProps) => {
  const arrowLength = 4 + (progress * 12); // 4px to 16px

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: progress }}
    >
      <motion.div
        className="flex flex-col items-center"
        animate={{
          y: [0, 4, 0],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <span className="text-base">Swipe down to shortlist movie</span>
        <svg
          width="24"
          height={arrowLength + 12} // Adding space for arrow head
          viewBox={`0 0 24 ${arrowLength + 12}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1="12"
            y1="0"
            x2="12"
            y2={arrowLength}
            stroke="white"
            strokeWidth="2"
          />
          <path
            d={`M6 ${arrowLength} L12 ${arrowLength + 6} L18 ${arrowLength}`}
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}; 