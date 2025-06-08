import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    // Get the form data from the request
    const formData = await request.formData()

    // Get authorization header from the request
    const authHeader = request.headers.get("authorization")

    // Forward the request to the ML API
    const response = await fetch("https://backendml-production-23c3.up.railway.app/predict", {
      method: "POST",
      body: formData,
      headers: {
        ...(authHeader && { Authorization: authHeader }),
      },
      // Don't set Content-Type header, let the browser set it with boundary for multipart/form-data
    })

    if (!response.ok) {
      throw new Error(`ML API responded with status: ${response.status}`)
    }

    const data = await response.json()

    // Return the response with CORS headers
    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    })
  } catch (error) {
    console.error("Error in predict API route:", error)

    return NextResponse.json(
      {
        error: "Failed to analyze image",
        details: error.message,
      },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      },
    )
  }
}

// Handle preflight requests
export async function OPTIONS(request) {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}
