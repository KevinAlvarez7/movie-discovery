import { Movie } from '@/types/movie';

export interface ShortlistedMovie extends Movie {
  shortlistedAt: number;  // timestamp for sorting
}

export interface StorageState {
  movies: ShortlistedMovie[];
  version: string;  // for future data structure changes
}

const STORAGE_KEY = 'movie-shortlist';
const MAX_MOVIES = 10;

export class ShortlistStorage {
  private static instance: ShortlistStorage;
  private state: StorageState;

  private constructor() {
    this.state = this.loadState();
  }

  static getInstance(): ShortlistStorage {
    if (!this.instance) {
      this.instance = new ShortlistStorage();
    }
    return this.instance;
  }

  private loadState(): StorageState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return { movies: [], version: '1.0' };
      }
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to load shortlist state:', e);
      return { movies: [], version: '1.0' };
    }
  }

  private saveState(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Failed to save shortlist state:', e);
      throw new Error('Failed to save to storage');
    }
  }

  addMovie(movie: Movie): boolean {
    if (this.state.movies.length >= MAX_MOVIES) {
      throw new Error('Shortlist is full');
    }

    if (this.state.movies.some(m => m.id === movie.id)) {
      throw new Error('Movie already in shortlist');
    }

    const shortlistedMovie: ShortlistedMovie = {
      ...movie,
      shortlistedAt: Date.now()
    };

    this.state.movies.push(shortlistedMovie);
    this.saveState();
    return true;
  }

  getMovies(): ShortlistedMovie[] {
    return [...this.state.movies].sort((a, b) => b.shortlistedAt - a.shortlistedAt);
  }

  getCount(): number {
    return this.state.movies.length;
  }

  clear(): void {
    this.state.movies = [];
    this.saveState();
  }

  isStorageAvailable(): boolean {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return true;
    } catch {
      return false;
    }
  }
} 