import React, { useState, useEffect } from 'react';
// Background image filter
import Image from 'next/image';
import { motion } from 'framer-motion';
// Types for our filters
type FilterOption = {
  id: string;
  name?: string;
  icon?: string;
  bgImage?: string;
};

const ToggleFilterBg = ({
  id,
  bgImage,
  isSelected,
  onToggle
}: FilterOption & {
  isSelected: boolean;
  onToggle: (id: string) => void;
}) => {
  // Ensure bgImage starts with '/'
  const imagePath = bgImage?.startsWith('/') ? bgImage : `/${bgImage}`;
  
  useEffect(() => {

  }, [imagePath, isSelected]);

  // Generate random tilt between -3 and 3 degrees
  const tiltAngle = React.useMemo(() => Math.random() * 12 - 2, []);

  return (
    <motion.div 
      className="bg-white p-1 w-full h-full rounded-full overflow-hidden flex items-center justify-center"
      // Framer Motion animation properties
      animate={{ 
        rotate: isSelected ? tiltAngle : 0,
        scale: isSelected ? 1.2 : 1, // Subtle scale effect on selection
        boxShadow: isSelected ? '2px 4px 10px rgba(0, 0, 0, 1)' : '2px 4px 2px rgba(0, 0, 0, 1)',
      }}
      transition={{ 
        duration: 0.3,
        type: "spring",
        stiffness: 200,
        damping: 15
      }}
      whileHover={{ 
        scale: 1.01, // Subtle hover effect
        transition: { duration: 0.2 }
      }}
    >

        <button 
          onClick={() => onToggle(id)}
          className={`rounded-full overflow-hidden h-11`}
        >
          <Image 
            src={imagePath || ''}
            alt={`Filter ${id}`}
            width={0}
            height={8}
            sizes="100vw"
            className="w-auto h-full object-cover"
            onError={() => console.error('Image failed to load:', imagePath)}
          />
        </button>

    </motion.div>    
  );
};



// Updated main component
const StreamingFilters = () => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const bgFilters: FilterOption[] = [
    { id: 'Netflix', bgImage: '/streamingLogos/Netflix_logo.png' },
    { id: 'Disney', bgImage: '/streamingLogos/disney_logo.png' },
    { id: 'Prime', bgImage: '/streamingLogos/Prime_logo.png' },
  ];

  const toggleFilter = (filterId: string) => {
    console.log('Filter clicked:', filterId);
    setSelectedFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  return (
    <div className="w-full flex flex-row items-center justify-center py-4">      
      {/* Background image filters */}
      <div className= "flex flex-row gap-2 space-x-4 px-4 overflow-visible" >
        {bgFilters.map((filter) => (
          <ToggleFilterBg
            key={filter.id}
            {...filter}
            isSelected={selectedFilters.includes(filter.id)}
            onToggle={toggleFilter}
          />
        ))}
      </div>
    </div>
  );
};

export default StreamingFilters;