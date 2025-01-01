// src/components/WatchProviders.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { CountryProviders } from '@/types/TMDBProvider';

interface WatchProvidersProps {
  movieId: number;
}

const WatchProviders = ({ movieId }: WatchProvidersProps) => {
  const [providers, setProviders] = useState<CountryProviders | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/providers/${movieId}`);
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        console.log('Provider data:', data);
        setProviders(data.providers);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchProviders();
    }
  }, [movieId]);

  if (loading) return <div className="text-sm text-gray-500">Loading providers...</div>;
  if (error) return <div className="text-sm text-red-500">{error}</div>;
  if (!providers) return <div className="text-sm text-gray-500">No streaming information available</div>;

  return (
    <div className="space-y-2">
      {providers.flatrate && (
        <div>
          <h3 className="text-sm font-medium mb-1">Available on:</h3>
          <div className="flex gap-2">
            {providers.flatrate.map((provider) => (
              <div 
                key={provider.provider_id}
                className="flex items-center gap-1"
              >
                <Image
                  src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                  alt={provider.provider_name}
                  width={24}
                  height={24}
                  className="rounded"
                />
                <span className="text-xs">{provider.provider_name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {providers.link && (
        <a 
          href={providers.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-500 hover:underline"
        >
          View all watching options
        </a>
      )}
    </div>
  );
};

export default WatchProviders;