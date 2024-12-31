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
      const isMobile = vw <= 480;

      if (isMobile) {
        const cardWidth = vw - 40;
        const cardHeight = cardWidth;
        
        setDimensions({
          cardWidth,
          cardHeight,
          gapWidth: 8,
          isMobile: true
        });
        

      } else {
        const cardWidth = Math.min(Math.max(350, vw * 0.25), 450);
        const cardHeight = cardWidth * 1.5;
        
        setDimensions({
          cardWidth,
          cardHeight,
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