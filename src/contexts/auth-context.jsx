"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const API_BASE_URL = "https://backend-mf-rohman6511-wmk9cpp4.leapcell.dev"

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem("user")
    const savedToken = localStorage.getItem("token")

    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error("Error parsing saved user:", error)
        localStorage.removeItem("user")
        localStorage.removeItem("token")
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle different error status codes
        if (response.status === 401) {
          throw new Error("Email atau password salah")
        } else if (response.status === 400) {
          throw new Error(data.message || "Data yang dikirim tidak valid")
        } else if (response.status >= 500) {
          throw new Error("Server sedang bermasalah, silakan coba lagi nanti")
        } else {
          throw new Error(data.message || "Login gagal")
        }
      }

      // Assuming the API returns user data and token
      const userData = {
        id: data.user?.id || data.id,
        email: data.user?.email || data.email,
        name: data.user?.name || data.name || email.split("@")[0],
      }

      setUser(userData)

      // Save user data and token to localStorage
      localStorage.setItem("user", JSON.stringify(userData))
      if (data.token) {
        localStorage.setItem("token", data.token)
      }

      return { success: true, user: userData }
    } catch (error) {
      console.error("Login error:", error)
      return {
        success: false,
        error: error.message || "Terjadi kesalahan saat login",
      }
    }
  }

  const register = async (name, email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle different error status codes
        if (response.status === 409) {
          throw new Error("Email sudah terdaftar, silakan gunakan email lain")
        } else if (response.status === 400) {
          throw new Error(data.message || "Data yang dikirim tidak valid")
        } else if (response.status >= 500) {
          throw new Error("Server sedang bermasalah, silakan coba lagi nanti")
        } else {
          throw new Error(data.message || "Registrasi gagal")
        }
      }

      // Assuming the API returns user data and token
      const userData = {
        id: data.user?.id || data.id,
        email: data.user?.email || data.email || email,
        name: data.user?.name || data.name || name,
      }

      setUser(userData)

      // Save user data and token to localStorage
      localStorage.setItem("user", JSON.stringify(userData))
      if (data.token) {
        localStorage.setItem("token", data.token)
      }

      return { success: true, user: userData }
    } catch (error) {
      console.error("Register error:", error)
      return {
        success: false,
        error: error.message || "Terjadi kesalahan saat registrasi",
      }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
  }

  // Function to get auth token for API calls
  const getAuthToken = () => {
    return localStorage.getItem("token")
  }

  // Function to make authenticated API calls
  const authenticatedFetch = async (url, options = {}) => {
    const token = getAuthToken()

    const defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
    }

    if (token) {
      defaultHeaders["Authorization"] = `Bearer ${token}`
    }

    return fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    })
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    getAuthToken,
    authenticatedFetch,
    API_BASE_URL,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
