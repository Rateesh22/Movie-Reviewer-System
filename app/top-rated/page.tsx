"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, Trophy, TrendingUp, Filter } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/header"
import { TrailerButton } from "@/components/trailer-button"
import { mockMovies } from "@/lib/mock-data"

export default function TopRatedPage() {
  const [sortBy, setSortBy] = useState("rating")
  const [filterGenre, setFilterGenre] = useState("all")
  const [filterYear, setFilterYear] = useState("all")

  // Get all unique genres and years for filters
  const allGenres = useMemo(() => {
    const genres = new Set<string>()
    mockMovies.forEach(movie => {
      movie.genre.forEach(g => genres.add(g))
    })
    return Array.from(genres).sort()
  }, [])

  const allYears = useMemo(() => {
    const years = new Set(mockMovies.map(movie => movie.year))
    return Array.from(years).sort((a, b) => b - a)
  }, [])

  // Filter and sort movies
  const topRatedMovies = useMemo(() => {
    let filtered = mockMovies.filter(movie => {
      // Filter by genre
      if (filterGenre !== "all" && !movie.genre.includes(filterGenre)) {
        return false
      }
      
      // Filter by year
      if (filterYear !== "all" && movie.year.toString() !== filterYear) {
        return false
      }
      
      return true
    })

    // Sort movies
    switch (sortBy) {
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "year":
        filtered.sort((a, b) => b.year - a.year)
        break
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      default:
        filtered.sort((a, b) => b.rating - a.rating)
    }

    return filtered
  }, [sortBy, filterGenre, filterYear])

  const getRankBadge = (index: number) => {
    if (index === 0) return { color: "bg-yellow-500", text: "#1" }
    if (index === 1) return { color: "bg-gray-400", text: "#2" }
    if (index === 2) return { color: "bg-amber-600", text: "#3" }
    return { color: "bg-blue-500", text: `#${index + 1}` }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-yellow-900 to-amber-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="h-8 w-8 text-yellow-400" />
              <h1 className="text-4xl font-bold">Top Rated Movies</h1>
            </div>
            <p className="text-xl opacity-90 mb-6">
              Discover the highest-rated movies as voted by our community of film enthusiasts.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>Rated 8.0+ and above</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>{topRatedMovies.length} movies found</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="font-medium">Filters:</span>
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="year">Newest First</SelectItem>
                <SelectItem value="title">A-Z</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterGenre} onValueChange={setFilterGenre}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Genres" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                {allGenres.map(genre => (
                  <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterYear} onValueChange={setFilterYear}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {allYears.map(year => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(filterGenre !== "all" || filterYear !== "all") && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setFilterGenre("all")
                  setFilterYear("all")
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Movies Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {topRatedMovies.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">No movies found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters to see more results.
              </p>
              <Button onClick={() => {
                setFilterGenre("all")
                setFilterYear("all")
              }}>
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="grid gap-6">
              {topRatedMovies.map((movie, index) => {
                const rankBadge = getRankBadge(index)
                return (
                  <Link key={movie.id} href={`/movie/${movie.id}`}>
                    <Card className="group hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-0">
                        <div className="flex gap-4 p-4">
                          {/* Rank Badge */}
                          <div className="flex-shrink-0 flex items-center">
                            <div className={`${rankBadge.color} text-white font-bold px-3 py-2 rounded-lg text-lg min-w-[60px] text-center`}>
                              {rankBadge.text}
                            </div>
                          </div>

                          {/* Movie Poster */}
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

                          {/* Movie Details */}
                          <div className="flex-1 space-y-3">
                            <div>
                              <h3 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
                                {movie.title}
                              </h3>
                              <p className="text-muted-foreground">{movie.year}</p>
                            </div>

                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1 bg-yellow-500 text-black px-2 py-1 rounded">
                                <Star className="h-4 w-4 fill-current" />
                                <span className="font-bold">{movie.rating}</span>
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
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
