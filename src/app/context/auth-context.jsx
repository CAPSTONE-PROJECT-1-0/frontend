"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in on initial load
    const token = document.cookie.includes("auth-token=")
    if (token) {
      // In a real app, you would validate the token and fetch user data
      setUser({ email: "user@example.com" })
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    // Simulate login API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simple validation for demo
    if (email === "user@example.com" && password === "password") {
      // Set cookie with expiration (7 days)
      document.cookie = `auth-token=authenticated; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
      setUser({ email })
      return { success: true }
    }

    return {
      success: false,
      error: "Invalid email or password. Try user@example.com/password for demo.",
    }
  }

  const register = async (name, email, password) => {
    // Simulate register API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, you would create a user in your database
    document.cookie = `auth-token=authenticated; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
    setUser({ email, name })
    return { success: true }
  }

  const logout = () => {
    // Remove the auth cookie
    document.cookie = "auth-token=; path=/; max-age=0"
    setUser(null)
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, loading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
