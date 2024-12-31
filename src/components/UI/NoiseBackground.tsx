// src/components/UI/NoiseBackground.tsx
import React, { useMemo, useEffect, useState } from 'react';
import { generateNoisePattern, getRGBColor, NoiseOptions } from '../../utils/useNoise';

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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const noisePattern = useMemo(() => {
    if (!isMounted) return '';
    return generateNoisePattern({ noiseSize, noiseOpacity });
  }, [noiseSize, noiseOpacity, isMounted]);

  return (
    <div
      className={`${className}`}
      style={{
        backgroundColor: baseColor ? getRGBColor(baseColor, baseOpacity) : 'white',
        backgroundImage: noisePattern ? `url(${noisePattern})` : 'none',
        backgroundRepeat: 'repeat',
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
};