'use client';

import { useState } from 'react';
import MovieCarousel from './MovieCarousel';
import { Movie } from '@/types/TMDBMovie';
import { useMovieContext } from '@/context/MovieContext';
import { useCardDimensions } from '@/hooks/useCardDimensions';

interface MovieCarouselWrapperProps {
  initialMovies: Movie[];
}

const MovieCarouselWrapper = ({ initialMovies }: MovieCarouselWrapperProps) => {
  const [movies, setMovies] = useState(initialMovies);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  
  const { addToShortlist, shortlistedMovies } = useMovieContext();
  const cardDimensions = useCardDimensions();

  const loadMoreMovies = async () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const response = await fetch(`/api/movies?page=${Math.ceil(movies.length / 20) + 1}`);
      const data = await response.json();
      setMovies(prev => [...prev, ...data.movies]);
    } catch (error) {
      console.error('Error loading more movies:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="flex-1 relative">
      <MovieCarousel
        initialMovies={movies}
        onLoadMore={loadMoreMovies}
        isLoading={isLoadingMore}
        onCurrentMovieChange={setCurrentMovie}
      />
      {currentMovie && (
        <div className="w-full flex flex-row justify-center items-center mt-2 px-5">
          <div 
            className="flex items-center justify-center gap-2 p-1 rounded-t-md bg-black/10 backdrop-blur-sm shadow-[0_0px_12px_0px_rgba(0,0,0,0.5)]"
            style={{ width: `${cardDimensions.cardWidth}px` }}
          >
            <button
              onClick={() => addToShortlist(currentMovie)}
              className="p-2 rounded-full text-white/50 hover:text-white font-handwritten text-sm w-auto"
            >
              <span>{shortlistedMovies.length} Shortlisted</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieCarouselWrapper; 