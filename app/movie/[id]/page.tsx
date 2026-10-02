"use client";

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, Clock, Calendar, ThumbsUp, ThumbsDown, Play } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/header"
import { TrailerModal } from "@/components/trailer-modal"
import { mockMovies, mockReviews } from "@/lib/mock-data"
import { ReviewModal } from "@/components/review-modal"
import { useState } from "react"
import { WatchlistButton } from "@/components/watchlist-button"

interface MoviePageProps {
  params: Promise<{
    id: string
  }>
}

function getMovieData(id: string) {
  const movieId = Number.parseInt(id)
  if (isNaN(movieId)) return null

  const movie = mockMovies.find((m) => m.id === movieId)
  if (!movie) return null

  const reviews = mockReviews.filter((r) => r.movie_id === movieId)

  return {
    movie,
    reviews,
  }
}

export default function MoviePage({ params }: MoviePageProps) {
  const resolvedParams = React.use(params)
  const data = getMovieData(resolvedParams.id)

  if (!data) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Movie Not Found</h1>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  const { movie, reviews } = data

  const [movieReviews, setMovieReviews] = useState(reviews)

  const handleNewReview = (newReview: any) => {
    setMovieReviews(prev => [newReview, ...prev])
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Movie Header */}
      <div className="relative">
        <div className="absolute inset-0">
          <Image
            src={movie.backdrop || "/placeholder.svg?height=600&width=1200"}
            alt={movie.title}
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
        </div>

        <div className="relative container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="relative group">
                <Image
                  src={movie.poster || "/placeholder.svg?height=600&width=400"}
                  alt={movie.title}
                  width={400}
                  height={600}
                  className="w-full max-w-sm mx-auto rounded-lg shadow-lg"
                />
                {/* Trailer overlay on poster */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                  <TrailerModal 
                    trailerUrl={movie.trailer_url} 
                    movieTitle={movie.title}
                    triggerClassName="bg-red-600 hover:bg-red-700"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
                <div className="flex items-center gap-4 text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {movie.year}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {movie.duration}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2 bg-yellow-500 text-black px-3 py-1 rounded-full">
                    <Star className="h-5 w-5 fill-current" />
                    <span className="font-bold text-lg">{movie.rating}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {movie.genre.map((g) => (
                      <Badge key={g} variant="outline">
                        {g}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Overview</h2>
                <p className="text-muted-foreground leading-relaxed">{movie.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Director</h3>
                  <p className="text-muted-foreground">{movie.director}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Cast</h3>
                  <p className="text-muted-foreground">{movie.cast.join(", ")}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <TrailerModal 
                  trailerUrl={movie.trailer_url} 
                  movieTitle={movie.title}
                />
                <ReviewModal 
                  movieId={movie.id}
                  movieTitle={movie.title}
                  triggerText="Rate Movie"
                  triggerClassName="bg-yellow-500 hover:bg-yellow-600 text-black"
                  onReviewSubmitted={handleNewReview}
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
                  size="lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Official Trailer</h2>
          <div className="max-w-4xl mx-auto">
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                src={movie.trailer_url}
                title={`${movie.title} Trailer`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      {/* Plot Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Plot</h2>
          <p className="text-muted-foreground leading-relaxed max-w-4xl">{movie.plot}</p>
        </div>
      </section>

      <Separator />

      {/* Reviews Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">User Reviews</h2>
            <ReviewModal 
              movieId={movie.id}
              movieTitle={movie.title}
              onReviewSubmitted={handleNewReview}
            />
          </div>

          <div className="space-y-6">
            {movieReviews.map((review) => (
              <Card key={review.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={review.user_avatar || "/placeholder.svg?height=40&width=40"} />
                        <AvatarFallback>{review.user_name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{review.user_name}</h3>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating / 2 ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{review.date}</p>
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{review.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed mb-4">{review.content}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <button className="flex items-center gap-1 text-muted-foreground hover:text-green-600">
                      <ThumbsUp className="h-4 w-4" />
                      Helpful ({review.helpful_votes})
                    </button>
                    <button className="flex items-center gap-1 text-muted-foreground hover:text-red-600">
                      <ThumbsDown className="h-4 w-4" />
                      Not Helpful ({review.not_helpful_votes})
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
