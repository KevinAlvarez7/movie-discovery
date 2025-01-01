// src/context/FilterContext.tsx
"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';

// Define types for our context
interface FilterContextType {
  selectedFilters: string[];
  toggleFilter: (filterId: string) => void;
  isFilterActive: (filterId: string) => boolean;
  clearFilters: () => void;
}

// Create the context
const FilterContext = createContext<FilterContextType | undefined>(undefined);

// Provider component
export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  // Toggle filter function
  const toggleFilter = useCallback((filterId: string) => {
    setSelectedFilters(prev => {
      // If filter is already selected, remove it
      if (prev.includes(filterId)) {
        console.log(`Removing filter: ${filterId}`);
        return prev.filter(id => id !== filterId);
      }
      // If filter is not selected, add it
      console.log(`Adding filter: ${filterId}`);
      return [...prev, filterId];
    });
  }, []);

  // Check if a filter is active
  const isFilterActive = useCallback((filterId: string) => {
    return selectedFilters.includes(filterId);
  }, [selectedFilters]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    console.log('Clearing all filters');
    setSelectedFilters([]);
  }, []);

  return (
    <FilterContext.Provider 
      value={{ 
        selectedFilters, 
        toggleFilter, 
        isFilterActive, 
        clearFilters 
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

// Custom hook to use the filter context
export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}