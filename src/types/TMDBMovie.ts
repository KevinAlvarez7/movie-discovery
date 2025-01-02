export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path?: string;
  overview?: string;
  release_date?: string;
  vote_average: number;
  providers?: {
    flatrate?: Array<{
      provider_id: number;
      provider_name: string;
      logo_path: string;
    }>;
  };
}

export interface TMDBResponse {
  results: Movie[];
  page: number;
  total_pages: number;
}
  