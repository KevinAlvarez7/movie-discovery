// New hook: useVisibleMovies.ts
import { useState, useEffect } from 'react';
import { Movie } from '../types/TMDBMovie';

export const useVisibleMovies = (allMovies: Movie[], visibleCount = 5) => {
  const [visibleMovies, setVisibleMovies] = useState<Movie[]>([]);
  
  useEffect(() => {
    // Only process visible movies initially
    setVisibleMovies(allMovies.slice(0, visibleCount));
    
    // Gradually add more movies
    let currentIndex = visibleCount;
    const addMoreMovies = () => {
      if (currentIndex >= allMovies.length) return;
      
      setVisibleMovies(prev => [
        ...prev, 
        ...allMovies.slice(currentIndex, currentIndex + 5)
      ]);
      currentIndex += 5;
    };
    
    const timer = setInterval(addMoreMovies, 100);
    return () => clearInterval(timer);
  }, [allMovies, visibleCount]);
  
  return visibleMovies;
};