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

    if (isNaN(movieId)) {
      return NextResponse.json({ error: "Invalid movie ID" }, { status: 400 })
    }

    const movies = await sql`
      SELECT * FROM movies WHERE id = ${movieId}
    `

    if (movies.length === 0) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 })
    }

    return NextResponse.json(movies[0])
  } catch (error) {
    console.error("Error fetching movie:", error)
    return NextResponse.json({ error: "Failed to fetch movie" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
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

    const { title, year, rating, duration, genre, director, cast, poster, backdrop, description, plot } = body

    const result = await sql`
      UPDATE movies 
      SET title = ${title}, year = ${year}, rating = ${rating}, duration = ${duration},
          genre = ${genre}, director = ${director}, cast = ${cast}, poster = ${poster},
          backdrop = ${backdrop}, description = ${description}, plot = ${plot},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${movieId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating movie:", error)
    return NextResponse.json({ error: "Failed to update movie" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const movieId = Number.parseInt(params.id)

    if (isNaN(movieId)) {
      return NextResponse.json({ error: "Invalid movie ID" }, { status: 400 })
    }

    const result = await sql`
      DELETE FROM movies WHERE id = ${movieId} RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Movie deleted successfully" })
  } catch (error) {
    console.error("Error deleting movie:", error)
    return NextResponse.json({ error: "Failed to delete movie" }, { status: 500 })
  }
}
