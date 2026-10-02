"use client"

import { useState } from "react"
import { Play, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"

interface TrailerModalProps {
  trailerUrl: string
  movieTitle: string
  triggerClassName?: string
}

export function TrailerModal({ trailerUrl, movieTitle, triggerClassName }: TrailerModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          size="lg" 
          className={`bg-red-600 hover:bg-red-700 text-white ${triggerClassName}`}
        >
          <Play className="h-4 w-4 mr-2 fill-current" />
          Watch Trailer
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full p-0 bg-black">
        <DialogTitle className="sr-only">{movieTitle} Trailer</DialogTitle>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 text-white hover:bg-white/20"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="aspect-video">
            <iframe
              src={`${trailerUrl}?autoplay=1&rel=0&modestbranding=1`}
              title={`${movieTitle} Trailer`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
