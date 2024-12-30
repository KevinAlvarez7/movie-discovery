// src/utils/noise.ts
export interface NoiseOptions {
    noiseSize?: number;
    noiseOpacity?: number;
    baseColor?: string;
    baseOpacity?: number;  // Keep in interface for type consistency
  }
  
  // Updated to handle opacity
  export const getRGBColor = (hex: string, opacity: number = 1): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };
  
  export const generateNoisePattern = ({
    noiseSize = 100,
    noiseOpacity = 0.15,
  }: Partial<NoiseOptions> = {}): string => {
    // Skip if running on server
    if (typeof document === 'undefined') return '';
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return '';
    
    canvas.width = noiseSize;
    canvas.height = noiseSize;
    
    // Fill with noise
    for (let x = 0; x < canvas.width; x++) {
      for (let y = 0; y < canvas.height; y++) {
        const value = Math.random() * 255;
        ctx.fillStyle = `rgba(${value},${value},${value},${noiseOpacity})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
    
    return canvas.toDataURL('image/png');
  };