// app/shortlist/page.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useMovieContext } from '@/context/MovieContext';
import MovieCard from '@/components/MovieCards/MovieCard';
import { NoiseBackground } from '@/components/UI/NoiseBackground';
import { ArrowLeft } from 'lucide-react';

export default function ShortlistPage() {
  const router = useRouter();
  const { shortlistedMovies } = useMovieContext();
  
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
    <main className="min-h-screen bg-gray-950">
      <NoiseBackground
        baseColor="#221F1F"
        noiseOpacity={0.02}
        noiseSize={240}
        className="min-h-screen p-4"
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
          <h1 className="font-handwritten text-xl text-white/70">
            Shortlisted Movies ({shortlistedMovies.length})
          </h1>
        </div>

        {/* Movie List */}
        {shortlistedMovies.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <p className="text-white/50 font-handwritten text-lg">
              No movies shortlisted yet
            </p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {shortlistedMovies.map((movie) => (
              <motion.div
                key={movie.id}
                variants={item}
                className="w-full aspect-[2/3]"
              >
                <MovieCard
                  title={movie.title}
                  poster_path={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : ''}
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