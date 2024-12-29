// src/context/MovieContext.tsx
"use client";

import React, { createContext, useContext, useState } from 'react';
import { Movie } from '@/types/movie';

interface MovieContextType {
  shortlistedMovies: Movie[];
  addToShortlist: (movie: Movie) => void;
  isMovieShortlisted: (movieId: number) => boolean;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export function MovieProvider({ children }: { children: React.ReactNode }) {
  const [shortlistedMovies, setShortlistedMovies] = useState<Movie[]>([]);

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
    <MovieContext.Provider value={{ shortlistedMovies, addToShortlist, isMovieShortlisted }}>
      {children}
    </MovieContext.Provider>
  );
}

export function useMovieContext() {
  const context = useContext(MovieContext);
  if (context === undefined) {
    throw new Error('useMovieContext must be used within a MovieProvider');
  }
  return context;
}