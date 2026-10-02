"use client"

// Mock watchlist storage using localStorage
export interface WatchlistItem {
  id: number
  title: string
  year: number
  rating: number
  poster: string
  genre: string[]
  addedAt: string
}

export class WatchlistManager {
  private static STORAGE_KEY = 'moviedb_watchlist'

  static getWatchlist(): WatchlistItem[] {
    if (typeof window === 'undefined') return []
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error loading watchlist:', error)
      return []
    }
  }

  static addToWatchlist(movie: Omit<WatchlistItem, 'addedAt'>): boolean {
    try {
      const watchlist = this.getWatchlist()
      
      // Check if movie is already in watchlist
      if (watchlist.some(item => item.id === movie.id)) {
        return false // Already in watchlist
      }

      const newItem: WatchlistItem = {
        ...movie,
        addedAt: new Date().toISOString()
      }

      watchlist.unshift(newItem) // Add to beginning
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(watchlist))
      
      // Dispatch custom event for UI updates
      window.dispatchEvent(new CustomEvent('watchlistUpdated'))
      
      return true
    } catch (error) {
      console.error('Error adding to watchlist:', error)
      return false
    }
  }

  static removeFromWatchlist(movieId: number): boolean {
    try {
      const watchlist = this.getWatchlist()
      const filteredWatchlist = watchlist.filter(item => item.id !== movieId)
      
      if (filteredWatchlist.length === watchlist.length) {
        return false // Movie wasn't in watchlist
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredWatchlist))
      
      // Dispatch custom event for UI updates
      window.dispatchEvent(new CustomEvent('watchlistUpdated'))
      
      return true
    } catch (error) {
      console.error('Error removing from watchlist:', error)
      return false
    }
  }

  static isInWatchlist(movieId: number): boolean {
    const watchlist = this.getWatchlist()
    return watchlist.some(item => item.id === movieId)
  }

  static getWatchlistCount(): number {
    return this.getWatchlist().length
  }

  static clearWatchlist(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY)
      window.dispatchEvent(new CustomEvent('watchlistUpdated'))
    } catch (error) {
      console.error('Error clearing watchlist:', error)
    }
  }
}
