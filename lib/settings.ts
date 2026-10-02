"use client"

// Settings management using localStorage
export interface UserSettings {
  theme: 'light' | 'dark' | 'system'
  language: string
  notifications: {
    email: boolean
    push: boolean
    reviews: boolean
    watchlist: boolean
  }
  privacy: {
    profileVisible: boolean
    reviewsVisible: boolean
    watchlistVisible: boolean
  }
  display: {
    moviesPerPage: number
    showTrailers: boolean
    autoplayTrailers: boolean
    showSpoilers: boolean
  }
  account: {
    name: string
    email: string
    avatar: string
    bio: string
  }
}

const defaultSettings: UserSettings = {
  theme: 'system',
  language: 'en',
  notifications: {
    email: true,
    push: false,
    reviews: true,
    watchlist: true
  },
  privacy: {
    profileVisible: true,
    reviewsVisible: true,
    watchlistVisible: true
  },
  display: {
    moviesPerPage: 20,
    showTrailers: true,
    autoplayTrailers: false,
    showSpoilers: false
  },
  account: {
    name: 'Movie Fan',
    email: 'user@example.com',
    avatar: '/placeholder-user.jpg',
    bio: 'Love watching movies and sharing reviews!'
  }
}

export class SettingsManager {
  private static STORAGE_KEY = 'moviedb_settings'

  static getSettings(): UserSettings {
    if (typeof window === 'undefined') return defaultSettings
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Merge with defaults to ensure all properties exist
        return { ...defaultSettings, ...parsed }
      }
      return defaultSettings
    } catch (error) {
      console.error('Error loading settings:', error)
      return defaultSettings
    }
  }

  static updateSettings(updates: Partial<UserSettings>): boolean {
    try {
      const currentSettings = this.getSettings()
      const newSettings = { ...currentSettings, ...updates }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newSettings))
      
      // Dispatch custom event for UI updates
      window.dispatchEvent(new CustomEvent('settingsUpdated', { 
        detail: newSettings 
      }))
      
      return true
    } catch (error) {
      console.error('Error updating settings:', error)
      return false
    }
  }

  static resetSettings(): boolean {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultSettings))
      window.dispatchEvent(new CustomEvent('settingsUpdated', { 
        detail: defaultSettings 
      }))
      return true
    } catch (error) {
      console.error('Error resetting settings:', error)
      return false
    }
  }
}
