"use server"

import { sql } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createReview(formData: FormData) {
  try {
    const movieId = Number.parseInt(formData.get("movie_id") as string)
    const userId = formData.get("user_id") as string
    const userName = formData.get("user_name") as string
    const userAvatar = formData.get("user_avatar") as string
    const rating = Number.parseInt(formData.get("rating") as string)
    const title = formData.get("title") as string
    const content = formData.get("content") as string

    // Validate required fields
    if (!movieId || !userId || !userName || !rating || !title || !content) {
      return { error: "All fields are required" }
    }

    if (rating < 1 || rating > 10) {
      return { error: "Rating must be between 1 and 10" }
    }

    // Check if user already reviewed this movie
    const existingReview = await sql`
      SELECT id FROM reviews WHERE movie_id = ${movieId} AND user_id = ${userId}
    `

    if (existingReview.length > 0) {
      return { error: "You have already reviewed this movie" }
    }

    // Create the review
    const result = await sql`
      INSERT INTO reviews (movie_id, user_id, user_name, user_avatar, rating, title, content)
      VALUES (${movieId}, ${userId}, ${userName}, ${userAvatar}, ${rating}, ${title}, ${content})
      RETURNING *
    `

    // Update movie average rating
    const [{ avg_rating }] = await sql`
      SELECT ROUND(AVG(rating)::numeric, 1) as avg_rating 
      FROM reviews 
      WHERE movie_id = ${movieId}
    `

    await sql`
      UPDATE movies 
      SET rating = ${avg_rating || 0}
      WHERE id = ${movieId}
    `

    revalidatePath(`/movie/${movieId}`)

    return {
      success: true,
      message: "Review created successfully",
      review: result[0],
    }
  } catch (error) {
    console.error("Error creating review:", error)
    return { error: "Failed to create review" }
  }
}

export async function addToWatchlist(userId: string, movieId: number) {
  try {
    // Check if already in watchlist
    const existing = await sql`
      SELECT id FROM watchlist WHERE user_id = ${userId} AND movie_id = ${movieId}
    `

    if (existing.length > 0) {
      return { error: "Movie already in watchlist" }
    }

    await sql`
      INSERT INTO watchlist (user_id, movie_id)
      VALUES (${userId}, ${movieId})
    `

    revalidatePath("/watchlist")

    return {
      success: true,
      message: "Movie added to watchlist",
    }
  } catch (error) {
    console.error("Error adding to watchlist:", error)
    return { error: "Failed to add to watchlist" }
  }
}

export async function removeFromWatchlist(userId: string, movieId: number) {
  try {
    const result = await sql`
      DELETE FROM watchlist 
      WHERE user_id = ${userId} AND movie_id = ${movieId}
      RETURNING id
    `

    if (result.length === 0) {
      return { error: "Movie not found in watchlist" }
    }

    revalidatePath("/watchlist")

    return {
      success: true,
      message: "Movie removed from watchlist",
    }
  } catch (error) {
    console.error("Error removing from watchlist:", error)
    return { error: "Failed to remove from watchlist" }
  }
}

export async function voteOnReview(reviewId: number, userId: string, voteType: "helpful" | "not_helpful") {
  try {
    // Check if user already voted on this review
    const existingVote = await sql`
      SELECT vote_type FROM review_votes 
      WHERE review_id = ${reviewId} AND user_id = ${userId}
    `

    if (existingVote.length > 0) {
      // Update existing vote if different
      if (existingVote[0].vote_type !== voteType) {
        await sql`
          UPDATE review_votes 
          SET vote_type = ${voteType}
          WHERE review_id = ${reviewId} AND user_id = ${userId}
        `
      } else {
        // Remove vote if same type (toggle off)
        await sql`
          DELETE FROM review_votes 
          WHERE review_id = ${reviewId} AND user_id = ${userId}
        `
      }
    } else {
      // Create new vote
      await sql`
        INSERT INTO review_votes (review_id, user_id, vote_type)
        VALUES (${reviewId}, ${userId}, ${voteType})
      `
    }

    // Update review vote counts
    const [helpfulCount] = await sql`
      SELECT COUNT(*) as count FROM review_votes 
      WHERE review_id = ${reviewId} AND vote_type = 'helpful'
    `

    const [notHelpfulCount] = await sql`
      SELECT COUNT(*) as count FROM review_votes 
      WHERE review_id = ${reviewId} AND vote_type = 'not_helpful'
    `

    await sql`
      UPDATE reviews 
      SET helpful_votes = ${helpfulCount.count}, 
          not_helpful_votes = ${notHelpfulCount.count}
      WHERE id = ${reviewId}
    `

    revalidatePath("/movie/[id]", "page")

    return {
      success: true,
      message: "Vote recorded successfully",
      helpful_votes: Number.parseInt(helpfulCount.count),
      not_helpful_votes: Number.parseInt(notHelpfulCount.count),
    }
  } catch (error) {
    console.error("Error voting on review:", error)
    return { error: "Failed to record vote" }
  }
}
