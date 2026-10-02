import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const movieId = Number.parseInt(params.id)
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    if (isNaN(movieId)) {
      return NextResponse.json({ error: "Invalid movie ID" }, { status: 400 })
    }

    const offset = (page - 1) * limit

    const reviews = await sql`
      SELECT r.*, 
             TO_CHAR(r.created_at, 'YYYY-MM-DD') as date
      FROM reviews r
      WHERE r.movie_id = ${movieId}
      ORDER BY r.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    // Get total count
    const [{ total }] = await sql`
      SELECT COUNT(*) as total FROM reviews WHERE movie_id = ${movieId}
    `

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total: Number.parseInt(total),
        totalPages: Math.ceil(Number.parseInt(total) / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const movieId = Number.parseInt(params.id)
    
    let body
    try {
      body = await request.json()
    } catch (jsonError) {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

    if (isNaN(movieId)) {
      return NextResponse.json({ error: "Invalid movie ID" }, { status: 400 })
    }

    const { user_id, user_name, user_avatar, rating, title, content } = body

    // Validate required fields
    if (!user_id || !user_name || !rating || !title || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (rating < 1 || rating > 10) {
      return NextResponse.json({ error: "Rating must be between 1 and 10" }, { status: 400 })
    }

    // Check if user already reviewed this movie
    const existingReview = await sql`
      SELECT id FROM reviews WHERE movie_id = ${movieId} AND user_id = ${user_id}
    `

    if (existingReview.length > 0) {
      return NextResponse.json({ error: "User has already reviewed this movie" }, { status: 409 })
    }

    const result = await sql`
      INSERT INTO reviews (movie_id, user_id, user_name, user_avatar, rating, title, content)
      VALUES (${movieId}, ${user_id}, ${user_name}, ${user_avatar}, ${rating}, ${title}, ${content})
      RETURNING *
    `

    // Update movie average rating
    await updateMovieRating(movieId)

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}

async function updateMovieRating(movieId: number) {
  try {
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
  } catch (error) {
    console.error("Error updating movie rating:", error)
  }
}
