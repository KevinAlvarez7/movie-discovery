// hooks/useCardDimensions.ts
import { useState, useEffect } from 'react';

interface CardDimensions {
  cardWidth: number;
  cardHeight: number;
  gapWidth: number;
  isMobile: boolean;
}

export const useCardDimensions = () => {
  // Initialize dimensions state
  const [dimensions, setDimensions] = useState<CardDimensions>({
    cardWidth: 0,
    cardHeight: 0,
    gapWidth: 24,
    isMobile: false
  });

  useEffect(() => {
    // Function to calculate dimensions based on viewport
    const calculateDimensions = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const isMobile = vw <= 480;

      if (isMobile) {
        // For mobile, use 80% of viewport height
        const cardHeight = vh * 0.8;
        // Calculate width based on 2:3 ratio
        const cardWidth = (cardHeight * 2) / 3;
        
        setDimensions({
          cardWidth,
          cardHeight,
          gapWidth: 8,
          isMobile: true
        });
      } else {
        // For desktop, use 70% of viewport height
        const cardHeight = vh * 0.7;
        // Calculate width based on 2:3 ratio
        const cardWidth = (cardHeight * 2) / 3;
        
        // Add constraints to prevent cards from getting too large
        const maxWidth = Math.min(vw * 0.3, 500);
        const finalWidth = Math.min(cardWidth, maxWidth);
        const finalHeight = (finalWidth * 3) / 2;

        setDimensions({
          cardWidth: finalWidth,
          cardHeight: finalHeight,
          gapWidth: Math.min(Math.max(8, vw * 0.05), 12),
          isMobile: false
        });
      }
    };

    // Calculate initial dimensions
    calculateDimensions();

    // Add resize listener
    window.addEventListener('resize', calculateDimensions);

    // Cleanup
    return () => window.removeEventListener('resize', calculateDimensions);
  }, []);

  return dimensions;
};