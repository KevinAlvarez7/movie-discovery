// src/types/TMDBProvider.ts

export interface Provider {
    logo_path: string;
    provider_id: number;
    provider_name: string;
    display_priority: number;
  }
  
  export interface CountryProviders {
    link: string;
    flatrate?: Provider[];
    rent?: Provider[];
    buy?: Provider[];
  }
  
  export interface WatchProviders {
    id: number;
    results: {
      [countryCode: string]: CountryProviders;
    };
  }