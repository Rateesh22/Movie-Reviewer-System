import { neon } from "@neondatabase/serverless"

// Make database connection optional and provide fallback
export let sql: any = null

try {
  if (process.env.DATABASE_URL) {
    sql = neon(process.env.DATABASE_URL)
  }
} catch (error) {
  console.warn("Database connection not available:", error)
}

// Database types
export interface Movie {
  id: number
  title: string
  year: number
  rating: number
  duration: string
  genre: string[]
  director: string
  cast: string[]
  poster: string
  backdrop: string
  description: string
  plot: string
  created_at: Date
  updated_at: Date
}

export interface Review {
  id: number
  movie_id: number
  user_id: string
  user_name: string
  user_avatar?: string
  rating: number
  title: string
  content: string
  helpful_votes: number
  not_helpful_votes: number
  created_at: Date
  updated_at: Date
}

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  created_at: Date
  updated_at: Date
}

export interface Watchlist {
  id: number
  user_id: string
  movie_id: number
  created_at: Date
}
