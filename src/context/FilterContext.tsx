// src/context/FilterContext.tsx
"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';


// Define types for our context
interface FilterContextType {
  selectedFilter: string | null;
  toggleFilter: (filterId: string) => void;
  isFilterActive: (filterId: string) => boolean;
  clearFilters: () => void;
}

// Create the context
const FilterContext = createContext<FilterContextType | undefined>(undefined);

// Provider component
export function FilterProvider({ children }: { children: React.ReactNode }) {

  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const toggleFilter = useCallback((filterId: string) => {
    setSelectedFilter(prevFilter => prevFilter === filterId ? null : filterId);
  }, []);
  
  const isFilterActive = useCallback((filterId: string) => {
    return selectedFilter === filterId;
  }, [selectedFilter]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    console.log('Clearing all filters');
    setSelectedFilter(null);
  }, []);

  return (
    <FilterContext.Provider 
      value={{ 
        selectedFilter, 
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