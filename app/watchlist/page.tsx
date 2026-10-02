"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Bookmark, Star, Calendar, Trash2, Filter, SortAsc } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/header"
import { TrailerButton } from "@/components/trailer-button"
import { WatchlistButton } from "@/components/watchlist-button"
import { WatchlistManager, type WatchlistItem } from "@/lib/watchlist"
import { toast } from "@/hooks/use-toast"

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [sortBy, setSortBy] = useState("dateAdded")
  const [filterGenre, setFilterGenre] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadWatchlist()

    const handleWatchlistUpdate = () => {
      loadWatchlist()
    }

    window.addEventListener('watchlistUpdated', handleWatchlistUpdate)
    return () => window.removeEventListener('watchlistUpdated', handleWatchlistUpdate)
  }, [])

  const loadWatchlist = () => {
    setIsLoading(true)
    try {
      const items = WatchlistManager.getWatchlist()
      setWatchlist(items)
    } catch (error) {
      console.error('Error loading watchlist:', error)
      toast({
        title: "Error",
        description: "Failed to load watchlist.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveFromWatchlist = (movieId: number, movieTitle: string) => {
    const success = WatchlistManager.removeFromWatchlist(movieId)
    if (success) {
      toast({
        title: "Removed from Watchlist",
        description: `${movieTitle} has been removed from your watchlist.`,
      })
    }
  }

  const handleClearWatchlist = () => {
    if (window.confirm('Are you sure you want to clear your entire watchlist?')) {
      WatchlistManager.clearWatchlist()
      toast({
        title: "Watchlist Cleared",
        description: "Your watchlist has been cleared.",
      })
    }
  }

  // Get unique genres for filtering
  const allGenres = Array.from(
    new Set(watchlist.flatMap(item => item.genre))
  ).sort()

  // Filter and sort watchlist
  const filteredAndSortedWatchlist = watchlist
    .filter(item => {
      if (filterGenre === "all") return true
      return item.genre.includes(filterGenre)
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "dateAdded":
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
        case "title":
          return a.title.localeCompare(b.title)
        case "year":
          return b.year - a.year
        case "rating":
          return b.rating - a.rating
        default:
          return 0
      }
    })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p>Loading your watchlist...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-900 to-blue-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <Bookmark className="h-8 w-8 text-purple-400" />
              <h1 className="text-4xl font-bold">My Watchlist</h1>
            </div>
            <p className="text-xl opacity-90 mb-6">
              Keep track of movies you want to watch. Never forget a great recommendation again.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{watchlist.length} movies saved</span>
              </div>
              {watchlist.length > 0 && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Latest: {new Date(watchlist[0]?.addedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Controls Section */}
      {watchlist.length > 0 && (
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
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
                    <SelectItem value="dateAdded">Date Added</SelectItem>
                    <SelectItem value="title">Title A-Z</SelectItem>
                    <SelectItem value="year">Year</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
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

                {filterGenre !== "all" && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setFilterGenre("all")}
                  >
                    Clear Filter
                  </Button>
                )}
              </div>

              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleClearWatchlist}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Watchlist Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredAndSortedWatchlist.length === 0 ? (
            <div className="text-center py-16">
              {watchlist.length === 0 ? (
                <>
                  <Bookmark className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold mb-2">Your watchlist is empty</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Start building your watchlist by adding movies you want to watch later.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Link href="/search">
                      <Button>Browse Movies</Button>
                    </Link>
                    <Link href="/top-rated">
                      <Button variant="outline">Top Rated</Button>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold mb-2">No movies match your filter</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your genre filter to see more results.
                  </p>
                  <Button onClick={() => setFilterGenre("all")}>
                    Clear Filter
                  </Button>
                </>
              )}
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredAndSortedWatchlist.map((item) => (
                <Card key={item.id} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex gap-4 p-4">
                      {/* Movie Poster */}
                      <div className="flex-shrink-0 relative">
                        <Link href={`/movie/${item.id}`}>
                          <Image
                            src={item.poster || "/placeholder.svg?height=180&width=120"}
                            alt={item.title}
                            width={120}
                            height={180}
                            className="rounded-lg object-cover"
                          />
                        </Link>
                        {/* Trailer button overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                          <TrailerButton 
                            trailerUrl={`https://www.youtube.com/embed/dQw4w9WgXcQ`} // Placeholder
                            movieTitle={item.title}
                            size="sm"
                          />
                        </div>
                      </div>

                      {/* Movie Details */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <Link href={`/movie/${item.id}`}>
                              <h3 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
                                {item.title}
                              </h3>
                            </Link>
                            <p className="text-muted-foreground">{item.year}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFromWatchlist(item.id, item.title)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                            <span className="font-medium">{item.rating}</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.genre.map((g) => (
                              <Badge key={g} variant="secondary" className="text-xs">
                                {g}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">Added:</span>{' '}
                          {new Date(item.addedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Link href={`/movie/${item.id}`}>
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </Link>
                          <WatchlistButton
                            movie={item}
                            size="sm"
                            variant="ghost"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
