import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    // Check products table
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("count()", { count: "exact" })

    if (productsError) {
      return NextResponse.json(
        {
          success: false,
          error: "Products table error: " + productsError.message,
          details: productsError,
        },
        { status: 500 },
      )
    }

    // Check reviews table
    const { data: reviews, error: reviewsError } = await supabase.from("reviews").select("count()", { count: "exact" })

    if (reviewsError) {
      return NextResponse.json(
        {
          success: false,
          error: "Reviews table error: " + reviewsError.message,
          details: reviewsError,
        },
        { status: 500 },
      )
    }

    // Check orders table
    const { data: orders, error: ordersError } = await supabase.from("orders").select("count()", { count: "exact" })

    if (ordersError) {
      return NextResponse.json(
        {
          success: false,
          error: "Orders table error: " + ordersError.message,
          details: ordersError,
        },
        { status: 500 },
      )
    }

    // Check order_items table
    const { data: orderItems, error: orderItemsError } = await supabase
      .from("order_items")
      .select("count()", { count: "exact" })

    if (orderItemsError) {
      return NextResponse.json(
        {
          success: false,
          error: "Order items table error: " + orderItemsError.message,
          details: orderItemsError,
        },
        { status: 500 },
      )
    }

    // Check profiles table
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("count()", { count: "exact" })

    if (profilesError) {
      return NextResponse.json(
        {
          success: false,
          error: "Profiles table error: " + profilesError.message,
          details: profilesError,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      tables: {
        products: products[0].count,
        reviews: reviews[0].count,
        orders: orders[0].count,
        orderItems: orderItems[0].count,
        profiles: profiles[0].count,
      },
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Configured" : "Missing",
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Configured" : "Missing",
    })
  } catch (error) {
    console.error("Error checking database:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to connect to database",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
