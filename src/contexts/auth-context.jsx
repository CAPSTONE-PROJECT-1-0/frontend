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

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token")
      const savedUser = localStorage.getItem("user")

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser))
        } catch (error) {
          console.error("Error parsing saved user:", error)
          localStorage.removeItem("user")
          localStorage.removeItem("token")
        }
      }

      setLoading(false)
    }

    checkAuth()
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

      // Extract user data and token
      const userData = {
        id: data.user?.id || data.id,
        email: data.user?.email || data.email,
        name: data.user?.name || data.name || email.split("@")[0],
      }

      // Save user data and token to state and localStorage
      setUser(userData)
      if (response.ok && data.token) {
        localStorage.setItem("user", data.name)
        localStorage.setItem("token", data.token)
      }


      // Save token to localStorage
      // if (response.ok && data.token) {
      // }

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

      // Extract user data and token
      const userData = {
        id: data.user?.id || data.id,
        email: data.user?.email || data.email || email,
        name: data.user?.name || data.name || name,
        password: data.user?.password || data.password || password,
        token: data.user?.token || data.token,
      }

      // Save user data and token to state and localStorage
      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))      // Save token to localStorage
      localStorage.setItem("token", JSON.stringify(userData))      // Save token to localStorage


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
    // Clear user from state
    setUser(null)

    // Remove user data and token from localStorage
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
