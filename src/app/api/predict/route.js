import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    // Get the form data from the request
    const formData = await request.formData()

    // Get authorization header from the request
    const authHeader = request.headers.get("authorization")

    if (!authHeader) {
      return NextResponse.json({ error: "Authorization token required" }, { status: 401 })
    }

    // Extract user info from headers
    const userEmail = request.headers.get("x-user-email")
    const userName = request.headers.get("x-user-name")

    // Validasi user info
    if (!userEmail || !userName) {
      return NextResponse.json({ error: "User email and name are required" }, { status: 400 })
    }

    // Add user info to form data
    formData.append("userEmail", userEmail)
    formData.append("userName", userName)

    // Forward the request to the ML API with authorization
    const response = await fetch("https://backendml-production-23c3.up.railway.app/predict", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: authHeader,
        "x-user-email": userEmail,
        "x-user-name": userName,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("ML API error:", errorText)
      throw new Error(`ML API responded with status: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, x-user-email, x-user-name",
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
          "Access-Control-Allow-Headers": "Content-Type, Authorization, x-user-email, x-user-name",
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
      "Access-Control-Allow-Headers": "Content-Type, Authorization, x-user-email, x-user-name",
    },
  })
}
