import React from 'react';

const TornContainer = ({ children, className = '' }) => {
  // Generate random jagged points for the torn effect
  const generateJaggedPath = () => {
    // Start from top-left
    let path = 'M 0 0';
    
    // Right edge jagged effect
    const rightX = 100;
    for (let y = 0; y <= 100; y += 5) {
      const randomX = rightX + (Math.random() * 3 - 1.5);
      path += ` L ${randomX} ${y}`;
    }
    
    // Bottom edge
    path += ` L 100 100 L 0 100`;
    
    // Left edge jagged effect
    for (let y = 100; y >= 0; y -= 5) {
      const randomX = 0 + (Math.random() * 3 - 1.5);
      path += ` L ${randomX} ${y}`;
    }
    
    path += ' Z';
    return path;
  };

  return (
    <div className="relative">
      {/* SVG mask for the torn effect */}
      <svg className="absolute w-0 h-0">
        <defs>
          <mask id="torn-mask">
            <path 
              d={generateJaggedPath()} 
              fill="white"
              vectorEffect="non-scaling-stroke"
              transform="scale(1)"
            />
          </mask>
        </defs>
      </svg>

      {/* Content container with mask applied */}
      <div 
        className={`relative ${className}`}
        style={{
          maskImage: 'url(#torn-mask)',
          WebkitMaskImage: 'url(#torn-mask)',
          maskMode: 'alpha',
          WebkitMask: 'alpha'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default TornContainer;