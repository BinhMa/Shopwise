"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { supabase, type Product, type CartItem } from "./supabase"
import { useAuth } from "./auth-context"
import { useToast } from "@/components/ui/use-toast"

interface CartContextType {
  items: CartItem[]
  isLoading: boolean
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  checkout: () => Promise<{ success: boolean; orderId?: string; error?: string }>
  itemCount: number
  subtotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        setItems(parsedCart)
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items])

  // Load product details for cart items
  useEffect(() => {
    const loadProductDetails = async () => {
      if (items.length === 0) return

      setIsLoading(true)
      try {
        const productIds = items.map((item) => item.product_id)
        const { data, error } = await supabase.from("products").select("*").in("id", productIds)

        if (error) {
          console.error("Error fetching product details:", error)
          return
        }

        // Update cart items with product details
        const updatedItems = items.map((item) => {
          const product = data.find((p) => p.id === item.product_id)
          return { ...item, product }
        })

        setItems(updatedItems)
      } catch (error) {
        console.error("Error loading product details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProductDetails()
  }, [items.map((item) => item.product_id).join(",")])

  const addItem = (product: Product, quantity = 1) => {
    // Check if item already exists in cart
    const existingItemIndex = items.findIndex((item) => item.product_id === product.id)

    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      const updatedItems = [...items]
      updatedItems[existingItemIndex].quantity += quantity
      setItems(updatedItems)
    } else {
      // Add new item
      setItems([
        ...items,
        {
          product_id: product.id,
          quantity,
          product,
          id: `temp-${Date.now()}`,
        },
      ])
    }

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
      duration: 2000,
    })
  }

  const removeItem = (productId: string) => {
    setItems(items.filter((item) => item.product_id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }

    setItems(items.map((item) => (item.product_id === productId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
    localStorage.removeItem("cart")
  }

  const checkout = async () => {
    if (!user) {
      return { success: false, error: "You must be logged in to checkout" }
    }

    if (items.length === 0) {
      return { success: false, error: "Your cart is empty" }
    }

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
        })
        .select()
        .single()

      if (orderError) {
        throw new Error(orderError.message)
      }

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
      }))

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

      if (itemsError) {
        throw new Error(itemsError.message)
      }

      // Clear cart after successful checkout
      clearCart()

      return { success: true, orderId: order.id }
    } catch (error) {
      console.error("Error during checkout:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "An error occurred during checkout",
      }
    }
  }

  // Calculate total number of items in cart
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  // Calculate subtotal
  const subtotal = items.reduce((total, item) => {
    const price = item.product?.price || 0
    return total + price * item.quantity
  }, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        isLoading,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        checkout,
        itemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
