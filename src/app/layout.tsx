"use client"

import { Outfit, Gloria_Hallelujah } from 'next/font/google'
import "./globals.css";
import { MovieProvider } from '@/context/MovieContext';
import { FilterProvider } from '@/context/FilterContext';
import { AnimatePresence } from 'framer-motion';
import PageLoader from '@/components/PageLoader';
import { useState, useEffect } from 'react';

const outfit = Outfit({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-outfit',
})

const handwritten = Gloria_Hallelujah({ 
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-handwritten',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en" className={`${outfit.variable} ${handwritten.variable}`}>
      <body 
        className={`${outfit.className} min-h-screen`}
        {...(mounted ? {} : { suppressHydrationWarning: true })}
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <PageLoader key="loader" />
          ) : (
            <FilterProvider>
              <MovieProvider>
                {children}
              </MovieProvider>
            </FilterProvider>
          )}
        </AnimatePresence>
      </body>
    </html>
  );
}
