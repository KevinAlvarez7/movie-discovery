// src/components/NoiseBackground.tsx
import React, { useMemo } from 'react';
import { generateNoisePattern, getRGBColor, NoiseOptions } from '../utils/useNoise';

interface NoiseBackgroundProps extends Partial<NoiseOptions> {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export const NoiseBackground: React.FC<NoiseBackgroundProps> = ({
  className = '',
  children,
  style,
  noiseSize = 100,
  noiseOpacity = 0.15,
  baseColor = '#ffffff',
  baseOpacity = 1,
  ...props
}) => {
  const noisePattern = useMemo(() => {
    return generateNoisePattern({ noiseSize, noiseOpacity });
  }, [noiseSize, noiseOpacity]);

  return (
    <div
      className={`relative ${className}`}
      style={{
        backgroundColor: baseColor ? getRGBColor(baseColor, baseOpacity) : 'white',
        backgroundImage: `url(${noisePattern})`,
        backgroundRepeat: 'repeat',
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
};