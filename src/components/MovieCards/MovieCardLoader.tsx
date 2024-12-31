// MovieCardSkeleton.tsx
import React from 'react';
import TornContainer from '../ui/TornContainer';
import { NoiseBackground } from '../ui/NoiseBackground';

const MovieCardSkeleton = () => {
  const tiltAngle = React.useMemo(() => Math.random() * 6 - 3, []);

  return (
    <div className="w-full h-full relative">
      {/* Main poster skeleton with shimmer */}
      <div className="absolute inset-0 bg-gray-300 rounded-xl overflow-hidden">
        <div 
          className="absolute inset-0 animate-[intensifiedShimmer_1.5s_ease-in-out_infinite]"
          style={{
            background: `linear-gradient(
              90deg, 
              rgba(255,255,255, 0) 0%,
              rgba(255,255,255, 0.3) 20%,
              rgba(255,255,255, 0.8) 50%,
              rgba(255,255,255, 0.3) 80%,
              rgba(255,255,255, 0) 100%
            )`,
            backgroundSize: '200% 100%',
          }}
        />
      </div>
      
      {/* Content container at bottom with tilt */}
      <div 
        className="absolute inset-0 flex items-end justify-center pb-4" 
        style={{ transform: `rotate(${tiltAngle}deg)` }}
      >
        <div className="w-fit flex flex-row items-center mx-4 mb-4 overflow-visible">
          <TornContainer>
            <NoiseBackground
              noiseSize={120}
              noiseOpacity={0.12}
              baseColor="#f1fafa"
              baseOpacity={0.7}
              className="w-fit flex flex-col justify-center p-4 gap-4 backdrop-blur-sm"
            >
              {/* Title skeleton */}
              <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto overflow-hidden relative">
                <div 
                  className="absolute inset-0 animate-[intensifiedShimmer_1.5s_ease-in-out_infinite]"
                  style={{
                    background: `linear-gradient(
                      90deg, 
                      rgba(255,255,255, 0) 0%,
                      rgba(255,255,255, 0.3) 20%,
                      rgba(255,255,255, 0.8) 50%,
                      rgba(255,255,255, 0.3) 80%,
                      rgba(255,255,255, 0) 100%
                    )`,
                    backgroundSize: '200% 100%',
                  }}
                />
              </div>
              
              {/* Rating skeleton */}
              <div className="flex items-center justify-center space-x-2">
                {[20, 16].map((width, i) => (
                  <div key={i} className={`h-5 bg-gray-200 rounded w-${width} overflow-hidden relative`}>
                    <div 
                      className="absolute inset-0 animate-[intensifiedShimmer_1.5s_ease-in-out_infinite]"
                      style={{
                        background: `linear-gradient(
                          90deg, 
                          rgba(255,255,255, 0) 0%,
                          rgba(255,255,255, 0.3) 20%,
                          rgba(255,255,255, 0.8) 50%,
                          rgba(255,255,255, 0.3) 80%,
                          rgba(255,255,255, 0) 100%
                        )`,
                        backgroundSize: '200% 100%',
                      }}
                    />
                  </div>
                ))}
              </div>
            </NoiseBackground>
          </TornContainer>
        </div>
      </div>
    </div>
  );
};

export default MovieCardSkeleton;