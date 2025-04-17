import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    // Kiểm tra kết nối
    const { data, error } = await supabase.from("products").select("count()", { count: "exact" })

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          details: {
            code: error.code,
            hint: error.hint,
            details: error.details,
          },
        },
        { status: 500 },
      )
    }

    // Kiểm tra cấu trúc bảng
    const { data: tableInfo, error: tableError } = await supabase
      .from("products")
      .select("id, name, price, image_url, description, category")
      .limit(1)

    if (tableError) {
      return NextResponse.json(
        {
          success: false,
          error: "Table structure error: " + tableError.message,
          details: {
            code: tableError.code,
            hint: tableError.hint,
            details: tableError.details,
          },
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      count: data[0].count,
      tableStructure: tableInfo ? "Valid" : "Unknown",
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Configured" : "Missing",
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Configured" : "Missing",
    })
  } catch (error) {
    console.error("Error checking Supabase connection:", error)
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
