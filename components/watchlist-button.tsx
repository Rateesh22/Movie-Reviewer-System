"use client"

import { useState, useEffect } from "react"
import { Bookmark, BookmarkCheck, Plus, Minus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { WatchlistManager, type WatchlistItem } from "@/lib/watchlist"
import { toast } from "@/hooks/use-toast"

interface WatchlistButtonProps {
  movie: {
    id: number
    title: string
    year: number
    rating: number
    poster: string
    genre: string[]
  }
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  showText?: boolean
}

export function WatchlistButton({ 
  movie, 
  variant = "outline", 
  size = "md", 
  showText = true 
}: WatchlistButtonProps) {
  const [isInWatchlist, setIsInWatchlist] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsInWatchlist(WatchlistManager.isInWatchlist(movie.id))

    const handleWatchlistUpdate = () => {
      setIsInWatchlist(WatchlistManager.isInWatchlist(movie.id))
    }

    window.addEventListener('watchlistUpdated', handleWatchlistUpdate)
    return () => window.removeEventListener('watchlistUpdated', handleWatchlistUpdate)
  }, [movie.id])

  const handleToggleWatchlist = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation if button is inside a link
    e.stopPropagation()
    
    setIsLoading(true)

    try {
      if (isInWatchlist) {
        const success = WatchlistManager.removeFromWatchlist(movie.id)
        if (success) {
          toast({
            title: "Removed from Watchlist",
            description: `${movie.title} has been removed from your watchlist.`,
          })
        }
      } else {
        const success = WatchlistManager.addToWatchlist({
          id: movie.id,
          title: movie.title,
          year: movie.year,
          rating: movie.rating,
          poster: movie.poster,
          genre: movie.genre
        })
        
        if (success) {
          toast({
            title: "Added to Watchlist",
            description: `${movie.title} has been added to your watchlist.`,
          })
        } else {
          toast({
            title: "Already in Watchlist",
            description: `${movie.title} is already in your watchlist.`,
            variant: "destructive"
          })
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const sizeClasses = {
    sm: "h-8 px-3 text-xs",
    md: "h-9 px-4 text-sm", 
    lg: "h-10 px-6 text-base"
  }

  const iconSize = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleWatchlist}
      disabled={isLoading}
      className={`${sizeClasses[size]} transition-colors ${
        isInWatchlist 
          ? 'bg-green-600 hover:bg-green-700 text-white border-green-600' 
          : ''
      }`}
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
      ) : isInWatchlist ? (
        <BookmarkCheck className={`${iconSize[size]} ${showText ? 'mr-2' : ''}`} />
      ) : (
        <Bookmark className={`${iconSize[size]} ${showText ? 'mr-2' : ''}`} />
      )}
      {showText && (isInWatchlist ? 'In Watchlist' : 'Add to Watchlist')}
    </Button>
  )
}
