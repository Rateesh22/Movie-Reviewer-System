"use client"

import { useState } from "react"
import { Star, Send } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ReviewFormProps {
  movieId: number
  movieTitle: string
  onSubmit?: (review: any) => void
  onCancel?: () => void
}

export function ReviewForm({ movieId, movieTitle, onSubmit, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!rating || !title.trim() || !content.trim()) {
      alert("Please fill in all fields and provide a rating.")
      return
    }

    setIsSubmitting(true)

    // Simulate user data (in a real app, this would come from authentication)
    const mockUser = {
      id: "550e8400-e29b-41d4-a716-446655440001",
      name: "MovieFan2024",
      avatar: "/placeholder-user.jpg"
    }

    const reviewData = {
      id: Date.now(), // Simple ID generation for demo
      movie_id: movieId,
      user_id: mockUser.id,
      user_name: mockUser.name,
      user_avatar: mockUser.avatar,
      rating,
      title: title.trim(),
      content: content.trim(),
      helpful_votes: 0,
      not_helpful_votes: 0,
      date: new Date().toISOString().split('T')[0],
      created_at: new Date(),
      updated_at: new Date(),
    }

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In a real app, this would be an API call
      console.log("Submitting review:", reviewData)
      
      // Call the onSubmit callback if provided
      if (onSubmit) {
        onSubmit(reviewData)
      }

      // Reset form
      setRating(0)
      setTitle("")
      setContent("")
      
      alert("Review submitted successfully!")
    } catch (error) {
      console.error("Error submitting review:", error)
      alert("Failed to submit review. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>MF</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">Write a Review</h3>
            <p className="text-sm text-muted-foreground">Share your thoughts about {movieTitle}</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div className="space-y-2">
            <Label htmlFor="rating">Your Rating *</Label>
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {Array.from({ length: 10 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className="p-1 hover:scale-110 transition-transform"
                    onMouseEnter={() => setHoveredRating(i + 1)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(i + 1)}
                  >
                    <Star
                      className={`h-6 w-6 ${
                        i < (hoveredRating || rating)
                          ? "fill-yellow-500 text-yellow-500"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-sm text-muted-foreground ml-2">
                {rating > 0 ? `${rating}/10` : "Click to rate"}
              </span>
            </div>
          </div>

          {/* Review Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Review Title *</Label>
            <Input
              id="title"
              placeholder="Summarize your review in a few words..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              required
            />
            <p className="text-xs text-muted-foreground">
              {title.length}/100 characters
            </p>
          </div>

          {/* Review Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Your Review *</Label>
            <Textarea
              id="content"
              placeholder="Share your detailed thoughts about the movie..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              maxLength={2000}
              required
            />
            <p className="text-xs text-muted-foreground">
              {content.length}/2000 characters
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting || !rating || !title.trim() || !content.trim()}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Review
                </>
              )}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
