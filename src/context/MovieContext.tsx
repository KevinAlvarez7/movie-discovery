// src/context/MovieContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Movie } from '@/types/TMDBMovie';

// Define the shape of our context
interface MovieContextType {
  shortlistedMovies: Movie[];
  isMovieShortlisted: (movieId: number) => boolean;
  addToShortlist: (movie: Movie) => Promise<void>;
  removeFromShortlist: (movieId: number) => Promise<void>;
  isLoading: boolean;
}

// Create the context
const MovieContext = createContext<MovieContextType | undefined>(undefined);

// Provider component
export function MovieProvider({ children }: { children: React.ReactNode }) {
  const [shortlistedMovies, setShortlistedMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch shortlisted movies on mount
  useEffect(() => {
    fetchShortlistedMovies();
  }, []);

  // Fetch all shortlisted movies from the database
  const fetchShortlistedMovies = async () => {
    try {
      const response = await fetch('/api/shortlist');
      const data = await response.json();
      if (Array.isArray(data)) {
        // Transform the data to match Movie type
        const movies: Movie[] = data.map(item => ({
          id: item.movieId,
          title: item.title,
          poster_path: item.posterPath,
          vote_average: item.voteAverage,
          providers: item.providers
        }));
        setShortlistedMovies(movies);
      }
    } catch (error) {
      console.error('Error fetching shortlisted movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if a movie is shortlisted
  const isMovieShortlisted = (movieId: number): boolean => {
    return shortlistedMovies.some(movie => movie.id === movieId);
  };

  // Add a movie to shortlist
  const addToShortlist = async (movie: Movie) => {
    try {
      const response = await fetch('/api/shortlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          movieId: movie.id,
          title: movie.title,
          posterPath: movie.poster_path,
          voteAverage: movie.vote_average,
          providers: movie.providers
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.action === 'added') {
          setShortlistedMovies(prev => [...prev, movie]);
          console.log('Movie added to shortlist:', movie.title);
        } else {
          setShortlistedMovies(prev => 
            prev.filter(m => m.id !== movie.id)
          );
          console.log('Movie removed from shortlist:', movie.title);
        }
      } else {
        console.error('Failed to toggle movie:', data.error);
      }
    } catch (error) {
      console.error('Error toggling movie shortlist:', error);
    }
  };

  // Remove a movie from shortlist
  const removeFromShortlist = async (movieId: number) => {
    try {
      console.log('Attempting to remove movie:', movieId);
      const response = await fetch(`/api/shortlist?movieId=${movieId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        setShortlistedMovies(prev => 
          prev.filter(movie => movie.id !== movieId)
        );
        console.log('Movie removed from shortlist:', movieId);
      } else {
        console.error('Failed to remove movie:', data.error);
        // Refresh the list to ensure UI is in sync with DB
        await fetchShortlistedMovies();
      }
    } catch (error) {
      console.error('Error removing movie from shortlist:', error);
      // Refresh the list on error to ensure UI is in sync with DB
      await fetchShortlistedMovies();
    }
  };

  const value = {
    shortlistedMovies,
    isMovieShortlisted,
    addToShortlist,
    removeFromShortlist,
    isLoading
  };

  return (
    <MovieContext.Provider value={value}>
      {children}
    </MovieContext.Provider>
  );
}

// Custom hook to use the movie context
export function useMovieContext() {
  const context = useContext(MovieContext);
  if (context === undefined) {
    throw new Error('useMovieContext must be used within a MovieProvider');
  }
  return context;
}