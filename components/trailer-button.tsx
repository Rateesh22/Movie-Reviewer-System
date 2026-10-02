"use client"

import { Play } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface TrailerButtonProps {
  trailerUrl: string
  movieTitle: string
  size?: "sm" | "md" | "lg"
  variant?: "default" | "outline" | "ghost"
}

export function TrailerButton({ trailerUrl, movieTitle, size = "md", variant = "default" }: TrailerButtonProps) {
  const handleClick = () => {
    window.open(trailerUrl, '_blank', 'noopener,noreferrer')
  }

  const sizeClasses = {
    sm: "h-8 px-3 text-xs",
    md: "h-9 px-4 text-sm",
    lg: "h-10 px-6 text-base"
  }

  const variantClasses = {
    default: "bg-red-600 hover:bg-red-700 text-white",
    outline: "border-red-600 text-red-600 hover:bg-red-600 hover:text-white",
    ghost: "text-red-600 hover:bg-red-50 hover:text-red-700"
  }

  return (
    <Button 
      onClick={handleClick}
      className={`${sizeClasses[size]} ${variantClasses[variant]} transition-colors`}
    >
      <Play className="h-3 w-3 mr-1 fill-current" />
      Trailer
    </Button>
  )
}
