import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const search = searchParams.get("search")
    const genre = searchParams.get("genre")
    const sortBy = searchParams.get("sortBy") || "rating"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    const offset = (page - 1) * limit

    let query = `
      SELECT id, title, year, rating, duration, genre, director, cast, poster, backdrop, description
      FROM movies
      WHERE 1=1
    `
    const params: any[] = []
    let paramIndex = 1

    if (search) {
      query += ` AND (title ILIKE $${paramIndex} OR director ILIKE $${paramIndex} OR $${paramIndex} = ANY(cast))`
      params.push(`%${search}%`)
      paramIndex++
    }

    if (genre) {
      query += ` AND $${paramIndex} = ANY(genre)`
      params.push(genre)
      paramIndex++
    }

    // Add sorting
    const validSortFields = ["title", "year", "rating", "created_at"]
    const sortField = validSortFields.includes(sortBy) ? sortBy : "rating"
    const order = sortOrder.toLowerCase() === "asc" ? "ASC" : "DESC"

    query += ` ORDER BY ${sortField} ${order}`
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
    params.push(limit, offset)

    const movies = await sql(query, params)

    // Get total count for pagination
    let countQuery = `SELECT COUNT(*) as total FROM movies WHERE 1=1`
    const countParams: any[] = []
    let countParamIndex = 1

    if (search) {
      countQuery += ` AND (title ILIKE $${countParamIndex} OR director ILIKE $${countParamIndex} OR $${countParamIndex} = ANY(cast))`
      countParams.push(`%${search}%`)
      countParamIndex++
    }

    if (genre) {
      countQuery += ` AND $${countParamIndex} = ANY(genre)`
      countParams.push(genre)
    }

    const [{ total }] = await sql(countQuery, countParams)

    return NextResponse.json({
      movies,
      pagination: {
        page,
        limit,
        total: Number.parseInt(total),
        totalPages: Math.ceil(Number.parseInt(total) / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching movies:", error)
    return NextResponse.json({ error: "Failed to fetch movies" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    let body
    try {
      body = await request.json()
    } catch (jsonError) {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }
    
    const { title, year, rating, duration, genre, director, cast, poster, backdrop, description, plot } = body

    // Validate required fields
    if (!title || !year || !genre || !director || !cast) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO movies (title, year, rating, duration, genre, director, cast, poster, backdrop, description, plot)
      VALUES (${title}, ${year}, ${rating || 0}, ${duration}, ${genre}, ${director}, ${cast}, ${poster}, ${backdrop}, ${description}, ${plot})
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating movie:", error)
    return NextResponse.json({ error: "Failed to create movie" }, { status: 500 })
  }
}
