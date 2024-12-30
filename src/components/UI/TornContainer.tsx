import React, { ReactNode, useRef, useEffect, useState } from 'react';

interface TornContainerProps {
  children: ReactNode;
  className?: string;
}

const TornContainer: React.FC<TornContainerProps> = ({ children, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const maskId = React.useId();

  useEffect(() => {
    if (!containerRef.current) return;
    const updateDimensions = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setDimensions({
          width: rect.width,
          height: rect.height
        });
      }
    };
    updateDimensions();
    const observer = new ResizeObserver(updateDimensions);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const generateJaggedPath = () => {
    const { width, height } = dimensions;
    if (!width || !height) return '';

    const segments = 28;
    const jaggedness = Math.min(width, height) * 0.1;
    
    const getRandom = () => (Math.random() - 0.5) * jaggedness;

    const path = [
      `M 0 0`,
      // Top edge (straight)
      `L ${width} 0`,
      // Right edge (jagged)
      ...Array(segments).fill(0).map((_, i) => 
        `L ${width + getRandom()} ${(i + 1) * (height / segments)}`
      ),
      // Bottom edge (straight)
      `L ${width} ${height} L 0 ${height}`,
      // Left edge (jagged)
      ...Array(segments).fill(0).map((_, i) => 
        `L ${getRandom()} ${height - ((i + 1) * (height / segments))}`
      ),
      'Z'
    ].join(' ');

    return path;
  };

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <div className={`relative ${className}`} style={{ clipPath: `url(#${maskId})` }}>
        {children}
      </div>
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ position: 'absolute', zIndex: 10 }}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        aria-hidden="true"
      >
        <defs>
          <clipPath id={maskId}>
            <path d={generateJaggedPath()} />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
};

export default TornContainer;