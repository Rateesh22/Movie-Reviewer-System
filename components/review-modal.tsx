"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ReviewForm } from "./review-form"

interface ReviewModalProps {
  movieId: number
  movieTitle: string
  triggerText?: string
  triggerClassName?: string
  onReviewSubmitted?: (review: any) => void
}

export function ReviewModal({ 
  movieId, 
  movieTitle, 
  triggerText = "Write a Review",
  triggerClassName,
  onReviewSubmitted 
}: ReviewModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleReviewSubmit = (review: any) => {
    if (onReviewSubmitted) {
      onReviewSubmitted(review)
    }
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className={triggerClassName}>{triggerText}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="sr-only">Rate {movieTitle}</DialogTitle>
        <ReviewForm
          movieId={movieId}
          movieTitle={movieTitle}
          onSubmit={handleReviewSubmit}
          onCancel={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
