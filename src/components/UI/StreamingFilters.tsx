import React, { useState } from 'react';

const StreamingFilters = () => {
  // State to track selected filters
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  
  // Filter options data
  const filters: Array<{ id: string; name: string; icon: string }> = [
    { id: 'netflix', name: 'Netflix', icon: '🎬' },
    { id: 'disney', name: 'Disney+', icon: '✨' },
    { id: 'prime', name: 'Prime', icon: '📺' },
    { id: 'apple', name: 'Apple TV', icon: '🍎' },
  ];

  // Handle filter selection
  const toggleFilter = (filterId: string) => {
    console.log('Filter clicked:', filterId);
    setSelectedFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  return (
    <div className="w-full py-4">
      {/* Scrollable container */}
      <div className="overflow-x-auto flex space-x-4 px-4">
        {filters.map(({ id, name, icon }) => (
          <button
            key={id}
            onClick={() => toggleFilter(id)}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-full
              whitespace-nowrap transition-all duration-300
              ${selectedFilters.includes(id)
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}
            `}
          >
            <span>{icon}</span>
            <span>{name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StreamingFilters;