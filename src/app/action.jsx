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
    return { error: "Semua kolom wajib diisi" }
  }

  if (password !== confirmPassword) {
    return { error: "Kata sandi tidak sama" }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { error: "Mohon masukan alamat email yang benar" }
  }

  if (password.length < 8) {
    return { error: "Kata sandi minimal 8 karakter" }
  }

  return { success: true, error: null }
}
