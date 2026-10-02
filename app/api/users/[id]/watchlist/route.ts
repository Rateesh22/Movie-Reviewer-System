import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const userId = params.id

    const watchlist = await sql`
      SELECT m.*, w.created_at as added_at
      FROM watchlist w
      JOIN movies m ON w.movie_id = m.id
      WHERE w.user_id = ${userId}
      ORDER BY w.created_at DESC
    `

    return NextResponse.json(watchlist)
  } catch (error) {
    console.error("Error fetching watchlist:", error)
    return NextResponse.json({ error: "Failed to fetch watchlist" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const userId = params.id
    
    let body
    try {
      body = await request.json()
    } catch (jsonError) {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }
    
    const { movie_id } = body

    if (!movie_id) {
      return NextResponse.json({ error: "Movie ID is required" }, { status: 400 })
    }

    // Check if already in watchlist
    const existing = await sql`
      SELECT id FROM watchlist WHERE user_id = ${userId} AND movie_id = ${movie_id}
    `

    if (existing.length > 0) {
      return NextResponse.json({ error: "Movie already in watchlist" }, { status: 409 })
    }

    const result = await sql`
      INSERT INTO watchlist (user_id, movie_id)
      VALUES (${userId}, ${movie_id})
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error adding to watchlist:", error)
    return NextResponse.json({ error: "Failed to add to watchlist" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const userId = params.id
    const { searchParams } = new URL(request.url)
    const movieId = searchParams.get("movie_id")

    if (!movieId) {
      return NextResponse.json({ error: "Movie ID is required" }, { status: 400 })
    }

    const result = await sql`
      DELETE FROM watchlist 
      WHERE user_id = ${userId} AND movie_id = ${movieId}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Movie not found in watchlist" }, { status: 404 })
    }

    return NextResponse.json({ message: "Movie removed from watchlist" })
  } catch (error) {
    console.error("Error removing from watchlist:", error)
    return NextResponse.json({ error: "Failed to remove from watchlist" }, { status: 500 })
  }
}
