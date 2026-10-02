import Link from "next/link"
import Image from "next/image"
import { Star, TrendingUp, Calendar, Users, Play } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { TrailerButton } from "@/components/trailer-button"
import { mockMovies } from "@/lib/mock-data"
import { WatchlistButton } from "@/components/watchlist-button"

// Use mock data directly to avoid database issues
const featuredMovies = mockMovies.slice(0, 4)
const trendingMovies = mockMovies.filter((movie) => movie.year >= 2020).slice(0, 4)

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-purple-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">Discover Amazing Movies</h1>
            <p className="text-xl mb-8 opacity-90">
              Explore millions of movies, read reviews, and share your thoughts with the community.
            </p>
            <div className="flex gap-4">
              <Link href="/search">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  Browse Movies
                </Button>
              </Link>
              <Link href="/top-rated">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-black bg-transparent"
                >
                  Top Rated
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Movies */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <Star className="h-6 w-6 text-yellow-500" />
            <h2 className="text-3xl font-bold">Featured Movies</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredMovies.map((movie) => (
              <Card key={movie.id} className="group hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-0">
                  <div className="relative">
                    <Link href={`/movie/${movie.id}`}>
                      <Image
                        src={movie.poster || "/placeholder.svg?height=400&width=300"}
                        alt={movie.title}
                        width={300}
                        height={400}
                        className="w-full h-80 object-cover rounded-t-lg"
                      />
                    </Link>
                    <div className="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 rounded flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      <span className="text-sm font-medium">{movie.rating}</span>
                    </div>
                    {/* Trailer button overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg flex items-center justify-center">
                      <TrailerButton 
                        trailerUrl={movie.trailer_url} 
                        movieTitle={movie.title}
                        size="lg"
                      />
                    </div>
                  </div>
                  <div className="p-4">
                    <Link href={`/movie/${movie.id}`}>
                      <h3 className="font-semibold text-lg mb-1 group-hover:text-blue-600 transition-colors">
                        {movie.title}
                      </h3>
                    </Link>
                    <p className="text-muted-foreground text-sm mb-2">{movie.year}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {movie.genre?.map((g) => (
                        <Badge key={g} variant="secondary" className="text-xs">
                          {g}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{movie.description}</p>
                    <div className="flex gap-2">
                      <TrailerButton 
                        trailerUrl={movie.trailer_url} 
                        movieTitle={movie.title}
                        size="sm"
                        variant="outline"
                      />
                      <Link href={`/movie/${movie.id}`}>
                        <Button size="sm" variant="ghost" className="text-xs">
                          Details
                        </Button>
                      </Link>
                      <WatchlistButton
                        movie={{
                          id: movie.id,
                          title: movie.title,
                          year: movie.year,
                          rating: movie.rating,
                          poster: movie.poster,
                          genre: movie.genre
                        }}
                        size="sm"
                        variant="ghost"
                        showText={false}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Movies */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="h-6 w-6 text-green-500" />
            <h2 className="text-3xl font-bold">Trending Now</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {trendingMovies.map((movie) => (
              <Card key={movie.id} className="group hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-0">
                  <div className="relative">
                    <Link href={`/movie/${movie.id}`}>
                      <Image
                        src={movie.poster || "/placeholder.svg?height=300&width=200"}
                        alt={movie.title}
                        width={200}
                        height={300}
                        className="w-full h-64 object-cover rounded-t-lg"
                      />
                    </Link>
                    <div className="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 rounded flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                      <span className="text-xs font-medium">{movie.rating}</span>
                    </div>
                    {/* Trailer button overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg flex items-center justify-center">
                      <TrailerButton 
                        trailerUrl={movie.trailer_url} 
                        movieTitle={movie.title}
                        size="md"
                      />
                    </div>
                  </div>
                  <div className="p-3">
                    <Link href={`/movie/${movie.id}`}>
                      <h3 className="font-semibold text-sm mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {movie.title}
                      </h3>
                    </Link>
                    <p className="text-muted-foreground text-xs mb-2">{movie.year}</p>
                    <div className="flex gap-1">
                      <TrailerButton 
                        trailerUrl={movie.trailer_url} 
                        movieTitle={movie.title}
                        size="sm"
                        variant="ghost"
                      />
                      <WatchlistButton
                        movie={{
                          id: movie.id,
                          title: movie.title,
                          year: movie.year,
                          rating: movie.rating,
                          poster: movie.poster,
                          genre: movie.genre
                        }}
                        size="sm"
                        variant="ghost"
                        showText={false}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-2">10,000+</h3>
              <p className="text-muted-foreground">Movies in Database</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-2">500K+</h3>
              <p className="text-muted-foreground">Active Users</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-yellow-100 p-4 rounded-full mb-4">
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold mb-2">2M+</h3>
              <p className="text-muted-foreground">Reviews Written</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
