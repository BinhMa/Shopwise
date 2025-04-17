import { createClient } from "@supabase/supabase-js"

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Create a singleton client
let supabaseInstance: ReturnType<typeof createClient> | null = null

export const getSupabase = () => {
  if (!supabaseInstance) {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Supabase URL or Anon Key is missing. Please check your environment variables.")
    }

    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
      },
    })
  }
  return supabaseInstance
}

export const supabase = getSupabase()

// Type definitions for our database tables
export type Product = {
  id: string
  name: string
  description?: string
  price: number
  image_url?: string
  category?: string
}

export type Review = {
  id: string
  product_id: string
  rating: number
  comment?: string
}

export type Order = {
  id: string
  user_id: string
  created_at?: string
}

export type OrderItem = {
  id: string
  order_id: string
  product_id: string
  quantity: number
  product?: Product
}

export type Profile = {
  id: string
  email: string
  password: string
  name?: string
  is_admin: boolean
}

export type CartItem = {
  product_id: string
  quantity: number
  product?: Product
  id?: string // For client-side use
}
