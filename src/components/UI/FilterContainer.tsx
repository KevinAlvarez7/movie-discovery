import React, { useEffect } from 'react';
import { Globe, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStreamingStore } from '@/store/streaming';
import { StreamingService } from '@/store/streaming';
import { Movie } from '@/types/TMDBMovie';

const regions = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' }
];

const RegionSelector = () => {
  const { currentRegion, setRegion } = useStreamingStore();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200">
        <Globe className="w-4 h-4" />
        <span>{currentRegion.flag} {currentRegion.name}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-[300px] overflow-y-auto">
        {regions.map((region) => (
          <DropdownMenuItem
            key={region.code}
            onClick={() => setRegion(region)}
            className="flex items-center justify-between"
          >
            <span>{region.flag} {region.name}</span>
            {currentRegion.code === region.code && <Check className="w-4 h-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const StreamingToggle = ({ service }: { service: StreamingService }) => {
  const { selectedServices, toggleService } = useStreamingStore();
  const isSelected = selectedServices.has(service);

  return (
    <button
      onClick={() => toggleService(service)}
      className={`px-4 py-2 rounded-full mx-2 transition-colors
        ${isSelected ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
    >
      {service}
    </button>
  );
};

const MovieList: React.FC = () => {
  const { isLoading, filteredMovies } = useStreamingStore();
  const movies = filteredMovies();

  if (isLoading) return <div>Loading...</div>;  // This uses isLoading

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {movies.map((movie: Movie) => (
        <div key={movie.id} className="p-4 border rounded-lg">
          <h3 className="font-bold">{movie.title}</h3>
          <div className="text-sm text-gray-500">
            Available on: {movie.providers?.join(', ') || 'No providers'}
          </div>
        </div>
      ))}
    </div>
  );
};

const StreamingFilter = () => {
  const { fetchMovies } = useStreamingStore();

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]); // Added fetchMovies to dependency array

  return (
    <div className="space-y-4">
      <div className="w-full overflow-x-auto">
        <div className="flex items-center space-x-4 p-4">
          <RegionSelector />
          <div className="flex space-x-2">
            <StreamingToggle service="Netflix" />
            <StreamingToggle service="Disney+" />
            <StreamingToggle service="Prime" />
            <StreamingToggle service="AppleTV" />
          </div>
        </div>
      </div>
      <MovieList />
    </div>
  );
};

export default StreamingFilter;