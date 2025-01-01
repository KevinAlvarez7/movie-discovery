"use client"

import { Outfit, Gloria_Hallelujah} from 'next/font/google'
import "./globals.css";
import { MovieProvider } from '../context/MovieContext';
import { useEffect, useState } from 'react';
import { FilterProvider } from '../context/FilterContext';

// Font configuration - remove the className property as it's not valid
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    // Apply the variables at the HTML level
    <html lang="en" className={`${outfit.variable} ${handwritten.variable}`}>
      {/* Apply Outfit as the base font */}
      <head>
        {/* Remove the preload tag since we can't know the first movie URL at build time */}
      </head>
      <body 
        className={outfit.className}
        {...(mounted ? {} : { suppressHydrationWarning: true })}
      >
        <FilterProvider>
          <MovieProvider>
            {children}
          </MovieProvider>
        </FilterProvider>
      </body>
    </html>
  );
}
