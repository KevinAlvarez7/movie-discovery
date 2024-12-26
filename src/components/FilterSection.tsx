// src/components/FilterSection.tsx
'use client';

import React from 'react';
import * as Select from '@radix-ui/react-select';
import * as Slider from '@radix-ui/react-slider';

interface FilterValues {
  type?: 'movie' | 'series';
  imdbRating?: number;
}

interface FilterSectionProps {
  onFilterChange?: (filters: FilterValues) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({ onFilterChange }) => {
  const handleFilterChange = (filters: FilterValues) => {
    onFilterChange?.(filters);
  };

  return (
    <div className="flex flex-col gap-6 p-4 bg-gray-100 rounded-lg shadow-md">
      <Select.Root onValueChange={(value: string) => {
        if (value === 'movie' || value === 'series') {
          handleFilterChange({ type: value });
        }
      }}>
        <Select.Trigger className="inline-flex items-center justify-between w-full px-4 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <Select.Value placeholder="Select type" />
        </Select.Trigger>
        <Select.Content className="overflow-hidden bg-white rounded-md shadow-lg">
          <Select.Item value="movie" className="px-4 py-2 text-sm hover:bg-blue-50 cursor-pointer">Movie</Select.Item>
          <Select.Item value="series" className="px-4 py-2 text-sm hover:bg-blue-50 cursor-pointer">Series</Select.Item>
        </Select.Content>
      </Select.Root>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Rating</label>
        <Slider.Root
          className="relative flex items-center w-full h-5"
          min={0}
          max={10}
          step={0.1}
          onValueChange={(value) => handleFilterChange({ imdbRating: value[0] })}
        >
          <Slider.Track className="relative w-full h-2 bg-gray-200 rounded-full">
            <Slider.Range className="absolute h-full bg-blue-500 rounded-full" />
          </Slider.Track>
          <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-blue-500 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </Slider.Root>
      </div>
    </div>
  );
};

export default FilterSection;