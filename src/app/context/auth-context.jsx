"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = document.cookie.includes("auth-token=")
    if (token) {
      setUser({ email: "user@example.com" })
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (email === email && password === password) {
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
    await new Promise((resolve) => setTimeout(resolve, 1000))
    document.cookie = `auth-token=authenticated; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
    setUser({ email, name })
    return { success: true }
  }

  const logout = () => {
    document.cookie = "auth-token=; path=/; max-age=0"
    setUser(null)
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, loading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
