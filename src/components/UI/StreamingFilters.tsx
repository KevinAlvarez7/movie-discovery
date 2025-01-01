// src/components/UI/StreamingFilters.tsx
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useFilters } from '@/context/FilterContext'; // Add this import

// Keep your existing FilterOption type
type FilterOption = {
  id: string;
  name?: string;
  icon?: string;
  bgImage?: string;
};

const ToggleFilterBg = ({ id, bgImage, onToggle }: FilterOption & { onToggle: (id: string) => void }) => {
  const { isFilterActive } = useFilters();
  const isSelected = isFilterActive(id);
  
  // Store animation values in a ref to persist across re-renders
  const animationRef = React.useRef({
    tiltAngle: Math.random() * 12 - 2,
    initialScale: 1,
  });
  
  return (
    <motion.div 
      className="bg-[#d0d0d0] m-1 p-1 w-full h-full rounded-full overflow-hidden flex items-center justify-center"
      initial={{ 
        rotate: 0,
        scale: animationRef.current.initialScale 
      }}
      animate={{ 
        rotate: isSelected ? animationRef.current.tiltAngle : 0,
        scale: isSelected ? 1.2 : animationRef.current.initialScale,
        boxShadow: isSelected ? '2px 4px 10px rgba(0, 0, 0, 1)' : '2px 4px 2px rgba(0, 0, 0, 1)',
      }}
      transition={{ 
        duration: 0.3,
        type: "spring",
        stiffness: 200,
        damping: 15
      }}
      whileHover={{ 
        scale: animationRef.current.initialScale * 1.01,
        transition: { duration: 0.2 }
      }}
    >
      <button 
        onClick={() => onToggle(id)}
        className="rounded-full overflow-hidden h-11"
      >
        <Image 
          src={bgImage || ''}
          alt={`Filter ${id}`}
          width={0}
          height={8}
          priority
          sizes="100vw"
          className="w-auto h-full object-cover"
          onError={() => console.error('Image failed to load:', bgImage)}
        />
      </button>
    </motion.div>    
  );
};

const StreamingFilters = () => {
  // Use the filters context
  const { toggleFilter } = useFilters();

  // Your existing filters array
  const bgFilters: FilterOption[] = [
    { id: 'Netflix', bgImage: '/streamingLogos/Netflix_logo.png' },
    { id: 'Disney', bgImage: '/streamingLogos/disney_logo.png' },
    { id: 'Prime', bgImage: '/streamingLogos/Prime_logo.png' },
  ];

  return (
    <div className="w-full flex flex-row items-center justify-center py-4">      
      <div className="flex flex-row gap-2 space-x-4 px-4 overflow-visible">
        {bgFilters.map((filter) => (
          <ToggleFilterBg
            key={filter.id}
            {...filter}
            onToggle={toggleFilter}
          />
        ))}
      </div>
    </div>
  );
};

export default StreamingFilters;