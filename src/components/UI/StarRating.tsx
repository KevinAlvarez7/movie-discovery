import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  className?: string;
}

const StarRating = ({ 
  rating, 
  maxRating = 10, 
  size = 16,
  className = ''
}: StarRatingProps) => {
  // Convert rating to 0-5 scale
  const normalizedRating = (rating / maxRating) * 5;
  
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {[...Array(5)].map((_, i) => {
        const fillPercentage = Math.max(0, Math.min(100, (normalizedRating - i) * 100));
        
        return (
          <div key={i} className="relative">
            <Star
              size={size}
              className="text-gray-400 drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)] stroke-[1.5] stroke-black/10"
              fill="currentColor"
            />
            <div 
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fillPercentage}%` }}
            >
              <Star
                size={size}
                className="text-yellow-400 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] stroke-[2] stroke-[#d6d6d6]"
                fill="currentColor"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StarRating; 