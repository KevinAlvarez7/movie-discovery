// src/components/UI/StreamingFilters.tsx
import React, { useCallback, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useFilters } from '@/context/FilterContext';

type FilterOption = {
  id: string;
  name?: string;
  icon?: string;
  bgImage?: string;
};

// StreamingFilters.tsx with optimized animations
const ToggleFilterBg = React.memo(({ 
  id, 
  bgImage, 
  onToggle 
}: FilterOption & { 
  onToggle: (id: string) => void 
}) => {
  const { isFilterActive } = useFilters();
  const isSelected = isFilterActive(id);
  
  const animationValues = useMemo(() => ({
    tiltAngle: Math.random() * 12 - 2,
    initialScale: 1,
  }), []);

  return (
    <motion.div 
      layoutId={`filter-${id}`}
      className="bg-[#d0d0d0] m-1 p-1 w-full h-full rounded-full overflow-hidden flex items-center justify-center"
      style={{ 
        willChange: 'transform, opacity',
        transform: 'translateZ(0)',
        containIntrinsicSize: '44px', // Add size hint
        contain: 'layout',
      }}
      initial={false}
      animate={{ 
        rotate: isSelected ? animationValues.tiltAngle : 0,
        scale: isSelected ? 1.2 : animationValues.initialScale,
        boxShadow: isSelected ? '2px 4px 10px rgba(0, 0, 0, 1)' : '2px 4px 2px rgba(0, 0, 0, 1)',
      }}
      transition={{ 
        type: "spring",
        stiffness: 400,
        damping: 30,
        mass: 0.8,
        duration: 0.3
      }}
      onClick={() => onToggle(id)}
    >
      <div className="rounded-full overflow-hidden h-11">
        <Image 
          src={bgImage || ''}
          alt={`Filter ${id}`}
          width={44}
          height={44}
          priority
          sizes="44px"
          className="w-auto h-full object-cover"
        />
      </div>
    </motion.div>    
  );
});

ToggleFilterBg.displayName = 'ToggleFilterBg';

const bgFilters: FilterOption[] = [
  { id: 'Netflix', bgImage: '/streamingLogos/Netflix_logo.png' },
  { id: 'Disney', bgImage: '/streamingLogos/disney_logo.png' },
  { id: 'Prime', bgImage: '/streamingLogos/Prime_logo.png' },
];

const StreamingFilters = () => {
  const { toggleFilter } = useFilters();
  const { selectedFilter } = useFilters();
  
  const handleToggle = useCallback((id: string) => {
    console.log('Filter toggled:', id);
    if (selectedFilter === id) {
      toggleFilter(null); // Deselect if already selected
    } else {
      toggleFilter(id);   // Select new filter
    }
  }, [selectedFilter, toggleFilter]);

  return (
    <div className="w-full flex flex-row items-center justify-center">      
      <div className="flex flex-row gap-2 space-x-4 px-4 overflow-visible">
        <AnimatePresence>
          {bgFilters.map((filter) => (
            <ToggleFilterBg
              key={filter.id}
              {...filter}
              onToggle={handleToggle}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default React.memo(StreamingFilters);