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
    <div className="filter-section">
      <Select.Root onValueChange={(value: string) => {
        if (value === 'movie' || value === 'series') {
          handleFilterChange({ type: value });
        }
      }}>
        <Select.Trigger>
          <Select.Value placeholder="Select type" />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="movie">Movie</Select.Item>
          <Select.Item value="series">Series</Select.Item>
        </Select.Content>
      </Select.Root>

      <Slider.Root
        min={0}
        max={10}
        step={0.1}
        onValueChange={(value) => handleFilterChange({ imdbRating: value[0] })}
      >
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumb />
      </Slider.Root>

      {/* Add more filter options for Rotten Tomatoes, Google Reviews, and streaming platforms */}
    </div>
  );
};

export default FilterSection;