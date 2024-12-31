import { create } from 'zustand'
import { Movie } from '@/types/TMDBMovie'
import { getWatchProviders } from '@/lib/tmdb'

export type StreamingService = 'Netflix' | 'Disney+' | 'Prime' | 'AppleTV'
export type Region = {
  code: string
  name: string
  flag: string
}

interface StreamingState {
    selectedServices: Set<StreamingService>
    currentRegion: Region
    isLoading: boolean
    // Add loading state per movie
    loadingMovies: Set<number> 
    // Add error handling
    error: string | null

  movies: Movie[] // Add this
  // Add these method signatures
  toggleService: (service: StreamingService) => void
  setRegion: (region: Region) => void
  updateMovieProviders: (movies: Movie[]) => Promise<Movie[]>
  fetchMovies: () => Promise<void>
  filteredMovies: () => Movie[]
}

export const useStreamingStore = create<StreamingState>((set, get) => ({
    selectedServices: new Set(),
    currentRegion: { code: 'US', name: 'United States', flag: '🇺🇸' },
    isLoading: false,
    loadingMovies: new Set<number>(),
    error: null,
    movies: [], // Add this

    // Add these methods
    fetchMovies: async () => {
        set({ isLoading: true })
        try {
            // Implement your fetch logic here
            const response = await fetch('/api/movies') // adjust endpoint
            const movies = await response.json()
            set({ movies })
        } catch (error) {
            set({ error: (error as Error).message })
        } finally {
            set({ isLoading: false })
        }
    },

    filteredMovies: () => {
        const state = get()
        return state.movies.filter(movie => 
            state.selectedServices.size === 0 || 
            movie.providers?.some(provider => 
                state.selectedServices.has(provider as StreamingService)
            )
        )
    },
  
    toggleService: (service) => {
      console.log('Toggling service:', service)
      set((state) => {
        const newServices = new Set(state.selectedServices)
        if (newServices.has(service)) {
          newServices.delete(service)
        } else {
          newServices.add(service)
        }
        return { selectedServices: newServices }
      })
    },
      
    setRegion: (region) => {
      console.log('Setting region:', region)
      set({ currentRegion: region })
    },
  
    updateMovieProviders: async (movies) => {
        console.log('Updating providers for region:', get().currentRegion)
        set({ isLoading: true, error: null })
        
        try {
          const moviesWithProviders = await Promise.all(
            movies.map(async (movie) => {
              const providers = await getWatchProviders(movie.id, get().currentRegion.code)
              return { 
                ...movie, 
                providers: providers.map((p: { provider_name: string }) => p.provider_name) 
              }
            })
          )
          return moviesWithProviders
        } catch (error) {
          set({ error: (error as Error).message })
          return movies
        } finally {
          set({ isLoading: false })
        }
      }
  }))