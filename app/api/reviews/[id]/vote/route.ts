import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

interface RouteParams {
  params: {
    id: string
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const reviewId = Number.parseInt(params.id)
    
    let body
    try {
      body = await request.json()
    } catch (jsonError) {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

    if (isNaN(reviewId)) {
      return NextResponse.json({ error: "Invalid review ID" }, { status: 400 })
    }

    const { user_id, vote_type } = body

    if (!user_id || !vote_type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!["helpful", "not_helpful"].includes(vote_type)) {
      return NextResponse.json({ error: "Invalid vote type" }, { status: 400 })
    }

    // Check if user already voted on this review
    const existingVote = await sql`
      SELECT vote_type FROM review_votes 
      WHERE review_id = ${reviewId} AND user_id = ${user_id}
    `

    if (existingVote.length > 0) {
      // Update existing vote if different
      if (existingVote[0].vote_type !== vote_type) {
        await sql`
          UPDATE review_votes 
          SET vote_type = ${vote_type}
          WHERE review_id = ${reviewId} AND user_id = ${user_id}
        `
      } else {
        // Remove vote if same type (toggle off)
        await sql`
          DELETE FROM review_votes 
          WHERE review_id = ${reviewId} AND user_id = ${user_id}
        `
      }
    } else {
      // Create new vote
      await sql`
        INSERT INTO review_votes (review_id, user_id, vote_type)
        VALUES (${reviewId}, ${user_id}, ${vote_type})
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

    return NextResponse.json({
      message: "Vote recorded successfully",
      helpful_votes: Number.parseInt(helpfulCount.count),
      not_helpful_votes: Number.parseInt(notHelpfulCount.count),
    })
  } catch (error) {
    console.error("Error recording vote:", error)
    return NextResponse.json({ error: "Failed to record vote" }, { status: 500 })
  }
}
