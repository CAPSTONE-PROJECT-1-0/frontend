"use server"

export async function loginUser(prevState, formData) {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const email = formData.get("email")
  const password = formData.get("password")

  if (email === email && password === password) {
    return { success: true, error: null }
  }

  return {
    error: "Invalid email or password. Try user@example.com/password for demo.",
  }
}

export async function registerUser(prevState, formData) {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const name = formData.get("name")
  const email = formData.get("email")
  const password = formData.get("password")
  const confirmPassword = formData.get("confirmPassword")

  if (!name || !email || !password || !confirmPassword) {
    return { error: "All fields are required" }
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { error: "Please enter a valid email address" }
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters long" }
  }

  return { success: true, error: null }
}
