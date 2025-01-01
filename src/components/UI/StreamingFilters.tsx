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

function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

const ToggleFilterBg = ({ id, bgImage, onToggle }: FilterOption & { onToggle: (id: string) => void }) => {
  const { isFilterActive } = useFilters();
  const isSelected = isFilterActive(id);
  
  const animationRef = React.useRef({
    tiltAngle: Math.random() * 12 - 2,
    initialScale: 1,
  });
  
  // Debounce the toggle handler
  const debouncedToggle = React.useCallback(
    debounce((id: string) => {
      onToggle(id);
    }, 100),
    [onToggle]
  );
  
  return (
    <motion.div 
      layoutId={`filter-${id}`}
      className="bg-[#d0d0d0] m-1 p-1 w-full h-full rounded-full overflow-hidden flex items-center justify-center"
      style={{ 
        willChange: 'transform, opacity',
        contain: 'layout',
        transform: 'translateZ(0)', // Force GPU acceleration
      }}
      initial={false} // Skip initial animation
      animate={{ 
        rotate: isSelected ? animationRef.current.tiltAngle : 0,
        scale: isSelected ? 1.2 : animationRef.current.initialScale,
        boxShadow: isSelected ? '2px 4px 10px rgba(0, 0, 0, 1)' : '2px 4px 2px rgba(0, 0, 0, 1)',
      }}
      transition={{ 
        duration: 0.15,
        type: "tween",
        ease: "easeOut",
        layoutX: { duration: 0.15 },
        layoutY: { duration: 0.15 },
      }}
      whileHover={{ 
        scale: animationRef.current.initialScale * 1.01,
        transition: { duration: 0.1 }
      }}
    >
      <button 
        onClick={() => debouncedToggle(id)}
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