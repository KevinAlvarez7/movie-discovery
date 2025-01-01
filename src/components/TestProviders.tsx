// src/components/TestProviders.tsx
'use client';

import { useEffect, useState } from 'react';

interface TestProvidersProps {
  movieId: number;
}

const TestProviders = ({ movieId }: TestProvidersProps) => {
  const [providers, setProviders] = useState(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch(`/api/providers/${movieId}`);
        const data = await response.json();
        
        console.log('Fetched providers:', data);
        setProviders(data);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to fetch providers');
      }
    };

    if (movieId) {
      fetchProviders();
    }
  }, [movieId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!providers) {
    return <div>Loading providers...</div>;
  }

  return (
    <div>
      <pre>{JSON.stringify(providers, null, 2)}</pre>
    </div>
  );
};

export default TestProviders;