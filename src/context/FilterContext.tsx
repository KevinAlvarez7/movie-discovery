// src/context/FilterContext.tsx
"use client";

import React, { createContext, useContext, useCallback, useTransition, useState } from 'react';

// Define types for our context
interface FilterContextType {
  selectedFilters: Set<string>;
  toggleFilter: (filterId: string) => void;
  isPending: boolean;
  isFilterActive: (filterId: string) => boolean;
}

// Create the context
export const FilterContext = createContext<FilterContextType>({} as FilterContextType);

// Provider component
export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  const toggleFilter = useCallback((filterId: string) => {
    // Handle UI state immediately
    setSelectedFilters(prev => {
      const next = new Set(prev);
      if (next.has(filterId)) {
        next.delete(filterId);
      } else {
        next.add(filterId);
      }
      return next;
    });

    // Handle data operations in a transition
    startTransition(() => {
      // Data filtering operations here
    });
  }, []);

  return (
    <FilterContext.Provider value={{ 
      selectedFilters, 
      toggleFilter,
      isPending,
      isFilterActive: useCallback((id: string) => selectedFilters.has(id), [selectedFilters])
    }}>
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