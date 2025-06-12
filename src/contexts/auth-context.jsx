"use client"
const API_BASE_URL = "https://becapstone-npc01011309-tu16d9a1.leapcell.dev"

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
  const [u, setU] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {

    const checkAuth = () => {
      const token = localStorage.getItem("token")
      const savedUser = localStorage.getItem("user")

      if (token && savedUser) {
        try {
          const us = JSON.parse(savedUser);
          setUser(us)
          setU(us)
          console.log({ u, user })
        } catch (error) {
          console.error("Error parsing saved user:", error)
          // localStorage.removeItem("user")
          // localStorage.removeItem("token")
        }
      }

      setLoading(false)
    }

    checkAuth()
    console.log({ user, u })
  }, [])

  // if (!user) {
  //   checkAuth();
  // }


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

      const result = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Email atau password salah")
        } else if (response.status === 400) {
          throw new Error(result.message || "Data yang dikirim tidak valid")
        } else if (response.status >= 500) {
          throw new Error("Server sedang bermasalah, silakan coba lagi nanti")
        } else {
          throw new Error(result.message || "Login gagal")
        }
      }

      const token = result.data.token || result.token
      if (!token) {
        throw new Error("Token tidak ditemukan dalam respons server");
      }

      // Extract user data and token
      const userData = {
        id: result.data?.id || result.id,
        email: result.data?.email || result.email,
        name: result.data?.name || result.name || email.split("@")[0],
        token: token,
      }

      // Save user data and token to state and localStorage
      setUser(userData)
      if (response.ok && result.data.token) {
        localStorage.setItem("user", JSON.stringify(userData))
        localStorage.setItem("token", token)
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
        if (response.status === 409) {
          throw new Error("Email has registered, use another email address")
        } else if (response.status === 400) {
          throw new Error(data.message || "Bad request. invalid data input")
        } else if (response.status >= 500) {
          throw new Error("Internal server error, try again later")
        } else {
          throw new Error(data.message || "Registration failed")
        }
      }

      const userData = {
        id: data.user?.id || data.id,
        email: data.user?.email || data.email || email,
        name: data.user?.name || data.name || name,
        password: data.user?.password || data.password || password,
      }

      setUser(userData)

      // if (response.ok && data.token) {
      //   localStorage.setItem("user", JSON.stringify(userData))
      //   localStorage.setItem("token", data.token)
      // }


      // if (data.token) {
      //   localStorage.setItem("token", data.token)
      // }

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

  const getAuthToken = () => {
    return localStorage.getItem("token")
  }

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
