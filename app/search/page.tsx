"use client"

import { Suspense, useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Star, Filter } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/header"
import { TrailerButton } from "@/components/trailer-button"
import { mockMovies } from "@/lib/mock-data"

function SearchResults() {
  const searchParams = useSearchParams()
  const [sortBy, setSortBy] = useState("relevance")
  
  const searchQuery = searchParams.get("q") || ""

  // Memoize filtered movies to prevent unnecessary recalculations
  const filteredMovies = useMemo(() => {
    if (!searchQuery) {
      return mockMovies
    }

    const searchTerm = searchQuery.toLowerCase().trim()
    
    const filtered = mockMovies.filter((movie) => {
      // Check title (with partial matching)
      if (movie.title.toLowerCase().includes(searchTerm)) return true
      
      // Check director
      if (movie.director.toLowerCase().includes(searchTerm)) return true
      
      // Check cast members
      if (movie.cast.some((actor) => actor.toLowerCase().includes(searchTerm))) return true
      
      // Check genres
      if (movie.genre.some((g) => g.toLowerCase().includes(searchTerm))) return true
      
      // Check description
      if (movie.description.toLowerCase().includes(searchTerm)) return true
      
      // Check plot
      if (movie.plot.toLowerCase().includes(searchTerm)) return true
      
      // Check year (convert to string for partial matching)
      if (movie.year.toString().includes(searchTerm)) return true
      
      // Additional fuzzy matching for common search patterns
      const titleWords = movie.title.toLowerCase().split(' ')
      const searchWords = searchTerm.split(' ')
      
      // Check if any search word matches any title word
      for (const searchWord of searchWords) {
        if (searchWord.length > 2) { // Only check words longer than 2 characters
          for (const titleWord of titleWords) {
            if (titleWord.includes(searchWord) || searchWord.includes(titleWord)) {
              return true
            }
          }
        }
      }
      
      return false
    })

    // Sort results by relevance
    const sortedResults = filtered.sort((a, b) => {
      const aTitle = a.title.toLowerCase()
      const bTitle = b.title.toLowerCase()
      
      // Exact title matches first
      if (aTitle === searchTerm) return -1
      if (bTitle === searchTerm) return 1
      
      // Title starts with search term
      if (aTitle.startsWith(searchTerm) && !bTitle.startsWith(searchTerm)) return -1
      if (bTitle.startsWith(searchTerm) && !aTitle.startsWith(searchTerm)) return 1
      
      // Then apply selected sorting
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating
        case "year":
          return b.year - a.year
        case "title":
          return a.title.localeCompare(b.title)
        default:
          // Default relevance: prefer higher rated movies
          return b.rating - a.rating
      }
    })

    return sortedResults
  }, [searchQuery, sortBy])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Search Results</h2>
          {searchQuery && (
            <p className="text-muted-foreground mt-1">
              Found {filteredMovies.length} results for "{searchQuery}"
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="year">Year</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {filteredMovies.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No movies found</h3>
          <p className="text-muted-foreground mb-4">
            Try searching with different keywords or browse our featured movies.
          </p>
          <Link href="/">
            <Button>Browse Featured Movies</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredMovies.map((movie) => (
            <Link key={movie.id} href={`/movie/${movie.id}`}>
              <Card className="group hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-0">
                  <div className="flex gap-4 p-4">
                    <div className="flex-shrink-0 relative">
                      <Image
                        src={movie.poster || "/placeholder.svg?height=180&width=120"}
                        alt={movie.title}
                        width={120}
                        height={180}
                        className="rounded-lg object-cover"
                      />
                      {/* Trailer button overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                        <TrailerButton 
                          trailerUrl={movie.trailer_url} 
                          movieTitle={movie.title}
                          size="sm"
                        />
                      </div>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
                          {movie.title}
                        </h3>
                        <p className="text-muted-foreground">{movie.year}</p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          <span className="font-medium">{movie.rating}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {movie.genre.map((g) => (
                            <Badge key={g} variant="secondary" className="text-xs">
                              {g}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                        {movie.description}
                      </p>

                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">Director:</span> {movie.director}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">Cast:</span> {movie.cast.slice(0, 3).join(", ")}
                        {movie.cast.length > 3 && "..."}
                      </div>

                      <div className="flex gap-2 pt-2">
                        <TrailerButton 
                          trailerUrl={movie.trailer_url} 
                          movieTitle={movie.title}
                          size="sm"
                          variant="outline"
                        />
                        <Button size="sm" variant="ghost" className="text-xs">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const query = formData.get("search") as string
    if (query.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(query.trim())}`
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Search Movies</h1>
          <form onSubmit={handleSearch} className="max-w-2xl">
            <Input
              name="search"
              placeholder="Search for movies, actors, directors..."
              className="text-lg h-12"
              defaultValue={initialQuery}
            />
          </form>
        </div>

        <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
          <SearchResults />
        </Suspense>
      </div>
    </div>
  )
}
