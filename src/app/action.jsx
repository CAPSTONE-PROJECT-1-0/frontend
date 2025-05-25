"use server"

export async function loginUser(prevState, formData) {
  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const email = formData.get("email")
  const password = formData.get("password")

  // This is where you would validate credentials against your database
  // For demo purposes, we'll just check for a dummy email/password
  if (email === "user@example.com" && password === "password") {
    // In a real app, you would set cookies/session here
    return { success: true, error: null }
  }

  return {
    error: "Invalid email or password. Try user@example.com/password for demo.",
  }
}

export async function registerUser(prevState, formData) {
  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const name = formData.get("name")
  const email = formData.get("email")
  const password = formData.get("password")
  const confirmPassword = formData.get("confirmPassword")

  // Basic validation
  if (!name || !email || !password || !confirmPassword) {
    return { error: "All fields are required" }
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" }
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { error: "Please enter a valid email address" }
  }

  // Password strength validation
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters long" }
  }

  // In a real app, you would create the user in your database here

  return { success: true, error: null }
}
