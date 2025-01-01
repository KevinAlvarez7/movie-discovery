// src/context/MovieContext.tsx
"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Movie } from '@/types/TMDBMovie';
import { matchesSelectedProviders } from '@/utils/providerMapping';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

interface MovieContextType {
  shortlistedMovies: Movie[];
  visibleMovies: Movie[];
  addToShortlist: (movie: Movie) => void;
  isMovieShortlisted: (movieId: number) => boolean;
  updateVisibleMovies: (filter: string | null) => void;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export function MovieProvider({ children }: { children: React.ReactNode }) {
  const [shortlistedMovies, setShortlistedMovies] = useState<Movie[]>([]);
  const [visibleMovies, setVisibleMovies] = useState<Movie[]>([]);

  const updateVisibleMovies = useCallback((filter: string | null) => {
    // Update visible movies based on filter
    setVisibleMovies(prev => 
      !filter ? prev : prev.filter(movie => 
        matchesSelectedProviders(movie.providers?.flatrate, filter ? [filter] : [])
      )
    );
  }, []);

  const addToShortlist = (movie: Movie) => {
    console.log('Attempting to add/remove movie:', movie.title);
    
    setShortlistedMovies(prevMovies => {
      const isAlreadyShortlisted = prevMovies.some(m => m.id === movie.id);
      
      if (isAlreadyShortlisted) {
        console.log('Movie already in shortlist, removing:', movie.title);
        return prevMovies.filter(m => m.id !== movie.id);
      } else {
        console.log('Adding movie to shortlist:', movie.title);
        return [...prevMovies, movie];
      }
    });
  };

  const isMovieShortlisted = (movieId: number) => {
    return shortlistedMovies.some(movie => movie.id === movieId);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <MovieContext.Provider value={{ 
        shortlistedMovies, 
        visibleMovies,
        addToShortlist, 
        isMovieShortlisted,
        updateVisibleMovies 
      }}>
        {children}
      </MovieContext.Provider>
    </QueryClientProvider>
  );
}

export function useMovieContext() {
  const context = useContext(MovieContext);
  if (context === undefined) {
    throw new Error('useMovieContext must be used within a MovieProvider');
  }
  return context;
}