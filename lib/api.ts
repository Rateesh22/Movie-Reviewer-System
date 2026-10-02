import type { Movie, Review } from "./db"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ""

export class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}/api${endpoint}`

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    const response = await fetch(url, config)

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Unknown error" }))
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    return response.json()
  }

  // Movies
  async getMovies(params?: {
    page?: number
    limit?: number
    search?: string
    genre?: string
    sortBy?: string
    sortOrder?: string
  }) {
    const searchParams = new URLSearchParams()

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }

    const query = searchParams.toString()
    return this.request<{
      movies: Movie[]
      pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
      }
    }>(`/movies${query ? `?${query}` : ""}`)
  }

  async getMovie(id: number) {
    return this.request<Movie>(`/movies/${id}`)
  }

  async createMovie(movie: Omit<Movie, "id" | "created_at" | "updated_at">) {
    return this.request<Movie>("/movies", {
      method: "POST",
      body: JSON.stringify(movie),
    })
  }

  async updateMovie(id: number, movie: Partial<Movie>) {
    return this.request<Movie>(`/movies/${id}`, {
      method: "PUT",
      body: JSON.stringify(movie),
    })
  }

  async deleteMovie(id: number) {
    return this.request<{ message: string }>(`/movies/${id}`, {
      method: "DELETE",
    })
  }

  // Reviews
  async getMovieReviews(movieId: number, params?: { page?: number; limit?: number }) {
    const searchParams = new URLSearchParams()

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }

    const query = searchParams.toString()
    return this.request<{
      reviews: Review[]
      pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
      }
    }>(`/movies/${movieId}/reviews${query ? `?${query}` : ""}`)
  }

  async createReview(
    movieId: number,
    review: {
      user_id: string
      user_name: string
      user_avatar?: string
      rating: number
      title: string
      content: string
    },
  ) {
    return this.request<Review>(`/movies/${movieId}/reviews`, {
      method: "POST",
      body: JSON.stringify(review),
    })
  }

  async voteOnReview(
    reviewId: number,
    vote: {
      user_id: string
      vote_type: "helpful" | "not_helpful"
    },
  ) {
    return this.request<{
      message: string
      helpful_votes: number
      not_helpful_votes: number
    }>(`/reviews/${reviewId}/vote`, {
      method: "POST",
      body: JSON.stringify(vote),
    })
  }

  // Users
  async createUser(user: { email: string; name: string; avatar?: string }) {
    return this.request<{ id: string; email: string; name: string; avatar?: string }>("/users", {
      method: "POST",
      body: JSON.stringify(user),
    })
  }

  // Watchlist
  async getWatchlist(userId: string) {
    return this.request<Movie[]>(`/users/${userId}/watchlist`)
  }

  async addToWatchlist(userId: string, movieId: number) {
    return this.request<{ id: number; user_id: string; movie_id: number }>(`/users/${userId}/watchlist`, {
      method: "POST",
      body: JSON.stringify({ movie_id: movieId }),
    })
  }

  async removeFromWatchlist(userId: string, movieId: number) {
    return this.request<{ message: string }>(`/users/${userId}/watchlist?movie_id=${movieId}`, {
      method: "DELETE",
    })
  }
}

export const apiClient = new ApiClient()
