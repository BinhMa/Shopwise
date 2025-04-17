"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "./supabase"
import { useRouter } from "next/navigation"

export type Profile = {
  id: string
  email: string
  name?: string
  is_admin: boolean
  avatar?: string
}

interface AuthContextType {
  user: Profile | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  updateProfile: (userData: Partial<Profile>) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check active session
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          const { data: profileData } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

          if (profileData) {
            setUser(profileData as Profile)
          } else {
            // Create a default profile if none exists
            const defaultProfile: Profile = {
              id: session.user.id,
              email: session.user.email || "",
              name: session.user.user_metadata?.name || "",
              is_admin: false,
            }
            setUser(defaultProfile)
          }
        }
      } catch (error) {
        console.error("Error checking session:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        try {
          const { data: profileData } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

          if (profileData) {
            setUser(profileData as Profile)
          } else {
            // Create a default profile if none exists
            const defaultProfile: Profile = {
              id: session.user.id,
              email: session.user.email || "",
              name: session.user.user_metadata?.name || "",
              is_admin: false,
            }
            setUser(defaultProfile)
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      // Get user profile data
      if (data.user) {
        try {
          const { data: profileData } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

          if (profileData) {
            setUser(profileData as Profile)
          } else {
            // Create a default profile if none exists
            const defaultProfile: Profile = {
              id: data.user.id,
              email: data.user.email || "",
              name: data.user.user_metadata?.name || "",
              is_admin: false,
            }
            setUser(defaultProfile)
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
        }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" }
    } finally {
      setIsLoading(false)
    }
  }
  const register = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true)
  
      // Đăng ký người dùng bằng Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      })
  
      if (error) {
        console.error("Auth signup error:", error.message)
        return { success: false, error: error.message }
      }
  
      if (!data.user) {
        return { success: false, error: "No user returned from signup" }
      }
  
      // Tạo bản ghi trong bảng profiles
      const newProfile: Profile = {
        id: data.user.id, // ⬅️ Phải khớp với auth.uid()
        email: data.user.email || "",
        name,
        is_admin: false, // Mặc định là user thường
      }
  
      const { error: profileError } = await supabase
        .from("profiles")
        .insert([newProfile])
  
      if (profileError) {
        console.error("Insert profile error:", profileError)
        return { success: false, error: "Database error saving new user: " + profileError.message }
      }
  
      // Nếu thành công, lưu vào state
      setUser(newProfile)
      return { success: true }
    } catch (err: any) {
      console.error("Unexpected register error:", err)
      return { success: false, error: "An unexpected error occurred" }
    } finally {
      setIsLoading(false)
    }
  }
  
  

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      router.push("/login")
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }

  const updateProfile = async (userData: Partial<Profile>) => {
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    try {
      // Update the profiles table
      const { error } = await supabase.from("profiles").update(userData).eq("id", user.id)

      if (error) {
        return { success: false, error: error.message }
      }

      // Update user metadata in auth
      await supabase.auth.updateUser({
        data: {
          name: userData.name,
        },
      })

      // Update local state
      const updatedUser: Profile = { ...user, ...userData }
      setUser(updatedUser)

      return { success: true }
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}