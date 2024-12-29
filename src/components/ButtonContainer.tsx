import { BookmarkButton } from './BookmarkButton';
import { ShortlistButton } from './ShortlistButton';

interface ButtonContainerProps {
  movieCount: number;
  onShortlist: () => void;
  onViewShortlist: () => void;
  isLoading: boolean;
}

export const ButtonContainer = ({ movieCount, onShortlist, onViewShortlist }: ButtonContainerProps) => {
  return (
    <div className="w-full flex justify-center mt-6 md:mt-8 px-4">
      <div className="flex gap-2 md:gap-3" style={{ width: '350px' }}> {/* Match center card width */}
        <BookmarkButton
          count={movieCount}
          onClick={onViewShortlist}
        />
        <ShortlistButton
          onClick={onShortlist}
          disabled={movieCount >= 10}
        />
      </div>
    </div>
  );
}; 