// app/shortlist/page.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useMovieContext } from '@/context/MovieContext';
import MovieCard from '@/components/MovieCards/MovieCard';
import { NoiseBackground } from '@/components/UI/NoiseBackground';
import { ArrowLeft } from 'lucide-react';
import { useCardDimensions } from '@/hooks/useCardDimensions';

export default function ShortlistPage() {
  const router = useRouter();
  const { shortlistedMovies } = useMovieContext();
  const { cardWidth, cardHeight, isMobile } = useCardDimensions();
  
  // Animation variants for list items
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <main className="h-[100dvh] bg-gray-950 flex flex-col">
      <NoiseBackground
        baseColor="#221F1F"
        noiseOpacity={0.02}
        noiseSize={240}
        className="h-full flex flex-col"
      >
        {/* Header */}
        <div className="w-full flex items-center justify-between p-4">
          <motion.button
            className="flex items-center gap-2 text-white/70 hover:text-white"
            onClick={() => router.back()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-handwritten">Back</span>
          </motion.button>
          <h1 className="font-handwritten text-lg text-white/70">
            Shortlisted Movies ({shortlistedMovies.length})
          </h1>
        </div>

        {/* Movie List */}
        {shortlistedMovies.length === 0 ? (
        <div className="flex flex-row items-center justify-center h-full">
            <div 
              className="rounded-2xl border-4 border-white/5 flex flex-col items-center justify-center"
              style={{ 
                width: `${cardWidth}px`,
                height: isMobile ? '85%' : `${cardHeight}px`,
              }}
            >
                <p className="text-white/50 font-handwritten text-lg">
                No movies shortlisted yet
                </p>
            </div>
        </div>

        ) : (
          <motion.div
            className="flex flex-row overflow-x-auto gap-6 p-4 pb-8 snap-x snap-mandatory
                       items-center w-full flex-grow"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
              paddingLeft: `max(2rem, calc((100vw - ${cardWidth}px) / 2))`,
              paddingRight: `max(2rem, calc((100vw - ${cardWidth}px) / 2))`
            }}
            variants={container}
            initial="hidden"
            animate="show"
          >
            {shortlistedMovies.map((movie) => (
              <motion.div
                key={movie.id}
                variants={item}
                className="flex-none snap-center first:ml-0"
                style={{ 
                  width: `${cardWidth}px`,
                  height: isMobile ? '85%' : `${cardHeight}px`,
                  aspectRatio: '2/3'
                }}
              >
                <MovieCard
                  title={movie.title}
                  poster_path={movie.poster_path}
                  voteAverage={movie.vote_average}
                  movieId={movie.id}
                  providers={movie.providers}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </NoiseBackground>
    </main>
  );
}