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

  const jaggedPath = React.useMemo(() => {
    const { width, height } = dimensions;
    if (!width || !height) return '';
  
    const segments = 50;
    const jaggedness = Math.min(width, height) * 0.1;
    const getRandom = () => (Math.random() - 0.65) * jaggedness;
  
    return [
      `M 0 0`,
      `L ${width} 0`,
      ...Array(segments).fill(0).map((_, i) => 
        `L ${width + getRandom()} ${(i + 1) * (height / segments)}`
      ),
      `L ${width} ${height} L 0 ${height}`,
      ...Array(segments).fill(0).map((_, i) => 
        `L ${getRandom()} ${height - ((i + 1) * (height / segments))}`
      ),
      'Z'
    ].join(' ');
  }, [dimensions]);

  return (
    <div ref={containerRef} className=" w-full h-full">
      <div className={` ${className}`} style={{ clipPath: `url(#${maskId})` }}>
        {children}
      </div>
      <svg 
        className=" inset-0 w-full h-full pointer-events-none"
        style={{ position: 'absolute', zIndex: 10 }}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        aria-hidden="true"
      >
        <defs>
          <clipPath id={maskId}>
            <path d={jaggedPath} />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
};

export default TornContainer;